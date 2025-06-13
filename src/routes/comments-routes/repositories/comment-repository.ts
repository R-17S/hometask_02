import { ObjectId } from "mongodb";
import {CommentInputModel, CommentViewModel} from "../../../models/commentTypes";
import {commentsCollection} from "../../../db/mongoDB";
import {CommentDbTypes} from "../../../db/comment-type";



export const commentsRepository = {
    async createComment(newComment: CommentDbTypes): Promise<ObjectId> {
        const result = await commentsCollection.insertOne(newComment);
        return result.insertedId
    },

    async updateComment(id: string, input: CommentInputModel) {
        const result = await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content: input.content } } // Обновляем только content
        );
        return result.modifiedCount === 1;
    },

    async getCommentById(commentId: string) {
        return await commentsCollection.findOne({ _id: new ObjectId(commentId) });
    },

    async deleteComment(id: string) {
        const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    },
};