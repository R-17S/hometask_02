import {PostByBlogIdInputModel, PostInputModel} from "../../models/postTypes";
import {ObjectId} from "mongodb";
import {postsRepository} from "./repositories/post-repositories";
import {blogsQueryRepository} from "../blogs-routes/repositories/blog-query-repository";
import {NotFoundException} from "../../helper/exceptions";



export const postsService = {
    async createPost(input: PostInputModel | PostByBlogIdInputModel, blogId?: string): Promise<ObjectId> {
        const effectiveBlogId = 'blogId' in input ? input.blogId : blogId;
        if (!effectiveBlogId) throw new NotFoundException('Blog ID is required');
        const blog = await blogsQueryRepository.getBlogByIdOrError(effectiveBlogId)

        const newPost = {
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: effectiveBlogId,
            blogName: blog.data!.name,
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

    async checkPostExists(postId: string): Promise<void> {
        const result = await postsRepository.postExists(postId);
        if (!result) throw new NotFoundException('Post not found');
    },
}