import {PostByBlogIdInputModel, PostInputModel} from "../../models/postTypes";
import {ObjectId} from "mongodb";
import {postsRepository} from "./repositories/post-repositories";
import {blogsQueryRepository} from "../blogs-routes/repositories/blog-query-repository";


export const postsService = {
    async createPost(input: PostInputModel | PostByBlogIdInputModel, id?: string): Promise<ObjectId | undefined> {
        const effectiveBlogId = 'blogId' in input ? input.blogId : id;
        if (!effectiveBlogId) return undefined;
        const blog = await blogsQueryRepository.getBlogById(effectiveBlogId)
        if (!blog) return undefined

        const newPost = {
            _id: new ObjectId(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: effectiveBlogId,
            blogName: blog.name,
            createdAt: new Date(),
        };

        return await postsRepository.createPost(newPost)
    },

    async updatePost(id: string, input: PostInputModel) {
        return await postsRepository.updatePost(id, input);
    },

    async deletePost(id: string) {
        return await postsRepository.deletePost(id);
    },
}