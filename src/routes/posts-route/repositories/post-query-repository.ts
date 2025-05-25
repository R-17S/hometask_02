import {PostsViewPaginated, PostInputQuery, PostViewModel} from "../../../models/postTypes";
import {postsCollection} from "../../../db/mongoDB";
import {PostDbTypes} from "../../../db/post-type";
import {ObjectId} from "mongodb";


export const postQueryRepository = {
    async getPostsByBlogId(id: string, params: PostInputQuery): Promise<PostsViewPaginated> {
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

    async getAllPosts(params: PostInputQuery): Promise<PostsViewPaginated> {
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
    },

    async getPostById(id: string): Promise<PostViewModel | null> {
        const result = await postsCollection.findOne({_id: new ObjectId(id)});
        if (!result) return null;
        return this.mapToPostViewModel(result);
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