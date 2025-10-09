import {PostsViewPaginated, PostViewModel, PostPaginationQueryResult} from "../../../models/postTypes";
import {PostDbTypes, PostModel} from "../../../db/post-type";
import {WithId} from "mongodb";
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
            PostModel.countDocuments(filter),
            PostModel
                .find(filter)
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean()
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
            PostModel.countDocuments({}),
            PostModel
                .find({})
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean()
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
        const result = await PostModel.findById(id);
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