import {PostsViewPaginated, PostViewModel, PostPaginationQueryResult} from "../../../models/postTypes";
import {PostDbTypes, PostModel} from "../../../db/post-type";
import {WithId} from "mongodb";
import {NotFoundException} from "../../../helper/exceptions";
import {injectable, inject} from "inversify";
import {PostsRepository} from "./post-repositories";
import {PostsService} from "../post-service";
import {MyLikeStatusTypes} from "../../../models/commentTypes";
import {PostLikeModel} from "../../../db/postLikeDb-type";
import {UserModel} from "../../../db/user-type";

@injectable()
export class PostsQueryRepository  {
    constructor(
        @inject(PostsService) private postsService: PostsService,
        @inject(PostsRepository) private postsRepository: PostsRepository,
    ) {}

    async getPostsByBlogId(id: string, params: PostPaginationQueryResult, userId?: string): Promise<PostsViewPaginated> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = params;

        const filter = {blogId: id};

        const [totalCount, posts] = await Promise.all([
            PostModel.countDocuments(filter),
            PostModel
                .find(filter)
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean()
        ])

        const items = await Promise.all(posts.map(async (post) => {
            const [myStatus, newestLikes] = await Promise.all([
                userId ? await this.postsService.getMyStatus(userId, post._id.toString()) : 'None',
                await this.getNewestLikes(post._id.toString()),
            ]);
            return this.mapToPostViewModel(
                post,
                myStatus as MyLikeStatusTypes,
                newestLikes
            )
        }))

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    }

    async getAllPosts(params: PostPaginationQueryResult, userId?: string): Promise<PostsViewPaginated> {
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = params;

        const [totalCount, posts] = await Promise.all([
            PostModel.countDocuments({}),
            PostModel
                .find({})
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean()
        ])

        const items = await Promise.all(posts.map(async (post) => {
            const [myStatus, newestLikes] = await Promise.all([
                userId ? this.postsService.getMyStatus(userId, post._id.toString()) : 'None',
                this.getNewestLikes(post._id.toString())
            ]);

            return this.mapToPostViewModel(
                post,
                myStatus as MyLikeStatusTypes,
                newestLikes,
            );
        }));


        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    }

    async getPostByIdOrError(id: string, userId?: string): Promise<PostViewModel> {
        const result = await PostModel.findById(id).lean();
        if (!result) throw new NotFoundException('Post not found');
        //надо наверно и тут промис ол вызывать
        const myStatus = userId
            ? await this.postsService.getMyStatus(userId, id)
            : 'None'
        const newestLikes = await this.getNewestLikes(id);
        return this.mapToPostViewModel(result, myStatus, newestLikes);
    }


    async getNewestLikes(postId: string): Promise<Array<{ addedAt: Date; userId: string; login: string }>> {
        const likes = await PostLikeModel.find({ postId, status: 'Like' })
            .sort({ updatedAt: -1 })
            .limit(3)
            .lean();

        // const users = await UserModel.find({
        //     _id: { $in: likes.map(like => like.userId) }
        // }).select({ _id: 1, login: 1 }).lean();
        //
        // return likes.map(like => {
        //     const user = users.find(u => u._id.toString() === like.userId);
        //     return {
        //         addedAt: like.updatedAt,
        //         userId: like.userId,
        //         login: user?.login ?? 'unknown',
        //     };
        // });

        const userIds = likes.map(like => like.userId);
        const users = await UserModel.find({ _id: { $in: userIds } })
            .select({ _id: 1, login: 1 })
            .lean();

        // Создаём Map для быстрого доступа по userId
        const userMap = new Map<string, string>();
        for (const user of users) {
            userMap.set(user._id.toString(), user.login);
        }
        return likes.map(like => ({
            addedAt: like.updatedAt,
            userId: like.userId,
            login: userMap.get(like.userId) ?? 'unknown',
        }));
    };


    mapToPostViewModel(input: WithId<PostDbTypes>, myStatus: MyLikeStatusTypes, newestLikes: Array<{ addedAt: Date; userId: string; login: string }>): PostViewModel {
        return {
            id: input._id.toString(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: input.blogName,
            createdAt: input.createdAt,
            extendedLikesInfo: {
                likesCount: input.likesCount ?? 0,
                dislikesCount: input.dislikesCount ?? 0,
                myStatus,
                newestLikes,
            }
        }
    }
}