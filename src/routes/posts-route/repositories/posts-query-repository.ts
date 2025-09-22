import {PostsViewPaginated, PostViewModel, PostPaginationQueryResult} from "../../../models/postTypes";
import {postsCollection} from "../../../db/mongoDB";
import {PostDbTypes} from "../../../db/post-type";
import {ObjectId, WithId} from "mongodb";
import {NotFoundException} from "../../../helper/exceptions";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository  {
    async getPostsByBlogId(id: string, params: PostPaginationQueryResult): Promise<PostsViewPaginated> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = params;

        const filter = {blogId: id};

        const [totalCount, posts] = await Promise.all([
            postsCollection.countDocuments(filter),
            postsCollection
                .find(filter)
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        ])

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(this.mapToPostViewModel)
        };
    }

    async getAllPosts(params: PostPaginationQueryResult): Promise<PostsViewPaginated> {
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = params;

        const [totalCount, posts] = await Promise.all([
            postsCollection.countDocuments({}),
            postsCollection
                .find({})
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        ])

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(this.mapToPostViewModel)
        };
    }

    async getPostByIdOrError(id: string): Promise<PostViewModel> {
        const result = await postsCollection.findOne({_id: new ObjectId(id)});
        if (!result) throw new NotFoundException('Post not found');
        return this.mapToPostViewModel(result);
    }


    mapToPostViewModel(input: WithId<PostDbTypes>): PostViewModel {
        return {
            id: input._id.toString(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: input.blogName,
            createdAt: input.createdAt
        }
    }
}