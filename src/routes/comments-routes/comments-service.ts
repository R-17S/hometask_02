import {inject, injectable} from "inversify";
import { CommentInputModel } from "../../models/commentTypes";
import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../users-routes/repositories/user-query-repository";
import {ForbiddenException, NotFoundException} from "../../helper/exceptions";
import {CommentsRepository} from "./repositories/comment-repository";
import {PostsRepository} from "../posts-route/repositories/post-repositories";


@injectable()
export class CommentsService  {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    ) {}

    async createComment(input: CommentInputModel, postId: string, userId: string): Promise<ObjectId> {
        const postExists = await this.postsRepository.postExists(postId);
        if (!postExists) throw new NotFoundException("Post not found");

        const user = await this.usersQueryRepository.getUserById(userId);
        if (!user) throw new NotFoundException("User not found");

        const newComment = {
            content: input.content,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.login
            },
            postId,
            createdAt: new Date(),
        }

        return await this.commentsRepository.createComment(newComment);
    }

    async updateComment(id: string, input: CommentInputModel) {
        return await this.commentsRepository.updateComment(id, input);
    }

    async checkCommentOwnership(commentId: string, userId: string): Promise<void> {
        const comment = await this.commentsRepository.getCommentById(commentId);
        if (!comment) throw new NotFoundException("Comment not found"); // Комментарий не найден
        if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException('If try edit the comment that is not your own');  //  Проверка прав доступа (403)
    }

    async deleteComment(id: string) {
        return await this.commentsRepository.deleteComment(id);
    }
}