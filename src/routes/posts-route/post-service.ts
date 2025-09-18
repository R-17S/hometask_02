import {PostByBlogIdInputModel, PostInputModel} from "../../models/postTypes";
import {ObjectId} from "mongodb";
import {PostsRepository} from "./repositories/post-repositories";
import {BlogsQueryRepository} from "../blogs-routes/repositories/blog-query-repository";
import {NotFoundException} from "../../helper/exceptions";
import {PostDbTypes} from "../../db/post-type";
import {inject, injectable} from "inversify/lib/esm";

@injectable()
export class  PostsService  {
    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository
    ) {}
    async createPost(input: PostInputModel | PostByBlogIdInputModel, blogId?: string): Promise<ObjectId> {
        const effectiveBlogId = 'blogId' in input ? input.blogId : blogId;
        if (!effectiveBlogId) throw new NotFoundException('Blog ID is required');
        const blog = await this.blogsQueryRepository.getBlogByIdOrError(effectiveBlogId)

        const newPost: PostDbTypes = {
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: effectiveBlogId,
            blogName: blog.name,
            createdAt: new Date(),
        };

        return await this.postsRepository.createPost(newPost)
    }

    async updatePost(id: string, input: PostInputModel) {
        return await this.postsRepository.updatePost(id, input);
    }

    async deletePost(id: string) {
        return await this.postsRepository.deletePost(id);
    }

    async checkPostExists(postId: string): Promise<void> {
        const result = await this.postsRepository.postExists(postId);
        if (!result) throw new NotFoundException('Post not found');
    }
}