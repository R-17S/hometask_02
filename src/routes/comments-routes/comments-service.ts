
import { CommentInputModel } from "../../models/commentTypes";
import {commentsRepository} from "./repositories/comment-repository";
import {commentQueryRepository} from "./repositories/comment-query-repository";
import {ObjectId} from "mongodb";
import {postsQueryRepository} from "../posts-route/repositories/posts-query-repository";

export const commentsService = {
    async createComment(input: CommentInputModel, postId: string): Promise<ObjectId | undefined> {
        const comment = await postsQueryRepository.postExists(postId);
        if (!comment) return undefined;

        const newComment = {
            _id: new ObjectId(),
            content: input.content,
            commentatorInfo: {
                userId: '4558358',
                userLogin: 'dndnf'
            },
            createdAt: new Date(),
        }

        return await commentsRepository.createComment(newComment);
    },

    async updateComment(id: string, input: CommentInputModel) {
        return await commentsRepository.updateComment(id, input);
    },

    async checkCommentOwnership(commentId: string, userId: string): Promise<boolean | null> {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) return null
        return comment?.commentatorInfo.userId === userId;
    },

    async deleteComment(id: string) {
        return await commentsRepository.deleteComment(id);
    },
};