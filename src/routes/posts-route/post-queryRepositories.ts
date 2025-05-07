import {PaginatedViewPosts, PostQueryParams, PostViewModel} from "../../models/postTypes";
import {postsCollection} from "../../db/mongoDB";
import {PostDbTypes} from "../../db/post-type";


export const postQueryRepositories = {
    async getPostsByBlogId(id: string, params: PostQueryParams): Promise<PaginatedViewPosts> {
        const {
            pageNumber = 1,
            pageSize = 1,
            sortBy = 'createdAt',
            sortDirection = 'desc',
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
    },

        mapToPostViewModel(input: PostDbTypes): PostViewModel {
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
};