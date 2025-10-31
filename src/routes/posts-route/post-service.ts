import {PostByBlogIdInputModel, PostInputModel} from "../../models/postTypes";
import {PostsRepository} from "./repositories/post-repositories";
import {NotFoundException} from "../../helper/exceptions";
import {PostModel} from "../../db/post-type";
import {inject, injectable} from "inversify";
import {BlogsRepository} from "../blogs-routes/repositories/blog-repositories";
import {MyLikeStatusTypes} from "../../models/commentTypes";

@injectable()
export class  PostsService  {
    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {}

    async createPost(input: PostInputModel | PostByBlogIdInputModel, blogId?: string): Promise<string> {
        const effectiveBlogId = 'blogId' in input ? input.blogId : blogId;
        if (!effectiveBlogId) throw new NotFoundException('Blog ID is required');

        const blogName = await this.blogsRepository.getBlogNameOrError(effectiveBlogId);

        const post = new PostModel({
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: effectiveBlogId,
            blogName: blogName,
            createdAt: new Date()
        });

        await this.postsRepository.save(post);
        return post._id.toString();
    }

    async updatePost(id: string, input: PostInputModel): Promise<void> {
        const post = await this.postsRepository.findById(id);
        if (!post) throw new Error('Post not found');// есть валидатор на проверку

        post.title = input.title;
        post.shortDescription = input.shortDescription;
        post.content = input.content;

        await this.postsRepository.save(post);
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.delete(id);
    }

    async checkPostExistsOrError(postId: string): Promise<void> {
        const exists = await this.postsRepository.exists(postId);
        if (!exists) throw new NotFoundException('Post not found');
    }

    async updateStatus(postId: string, userId: string, status: MyLikeStatusTypes) {
        await this.postsRepository.upsert(userId, postId, status);
        const [likesCount, dislikesCount] = await Promise.all([
            this.postsRepository.getLikesCount(postId),
            this.postsRepository.getDislikesCount(postId),
        ]);
        await this.postsRepository.updateLikeCounts(postId, likesCount, dislikesCount);
    };

    async getMyStatus(userId: string, postId: string): Promise<MyLikeStatusTypes> {
        return this.postsRepository.getMyStatus(userId, postId);
    }

    async getLikesCount(postId: string): Promise<{likesCount: number, dislikesCount: number}> {
        const likesCount = await this.postsRepository.getLikesCount(postId);
        const dislikesCount = await this.postsRepository.getDislikesCount(postId);
        return {likesCount, dislikesCount}
    }
}