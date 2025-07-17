
import { CommentInputModel } from "../../models/commentTypes";
import {commentsRepository} from "./repositories/comment-repository";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../users-routes/repositories/user-query-repository";
import {postsRepository} from "../posts-route/repositories/post-repositories";
import {ForbiddenException, NotFoundException} from "../../helper/exceptions";



export const commentsService = {
    async createComment(input: CommentInputModel, postId: string, userId: string): Promise<ObjectId> {
        const postExists = await postsRepository.postExists(postId);
        if (!postExists) throw new NotFoundException("Post not found");

        const user = await usersQueryRepository.getUserByIdOrError(userId);
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

        return await commentsRepository.createComment(newComment);

    },

    async updateComment(id: string, input: CommentInputModel) {
        return await commentsRepository.updateComment(id, input);
    },

    async checkCommentOwnership(commentId: string, userId: string): Promise<void> {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) throw new NotFoundException("Comment not found"); // Комментарий не найден
        if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException('If try edit the comment that is not your own');  //  Проверка прав доступа (403)
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(id);
    },
};