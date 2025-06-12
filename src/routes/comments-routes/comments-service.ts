
import { CommentInputModel } from "../../models/commentTypes";
import {commentsRepository} from "./repositories/comment-repository";
import {commentQueryRepository} from "./repositories/comment-query-repository";
import {ObjectId} from "mongodb";

export const commentsService = {
    async createComment(input: CommentInputModel, postId: string): Promise<ObjectId | undefined> {
        const comment = await commentQueryRepository.getCommentById(postId);
        if (!comment) return undefined;

        const newComment = {
            _id: new ObjectId(),
            content: input.content,
            commentatorInfo: {
                userId: input.commentatorInfo.userId,
                userLogin: input.commentatorInfo.userLogin,
            },
            createdAt: input.createdAt
        }

        return await commentsRepository.createComment(newComment);
    },

    async updateComment(id: string, input: CommentInputModel) {
        return await commentsRepository.updateComment(id, input);
    },

    async checkCommentOwnership(commentId: string, userId: string) {
        const comment = await commentsRepository.getCommentById(commentId);
        return comment?.commentatorInfo.userId === userId;
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(id);
    },
};