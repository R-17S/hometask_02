import {ObjectId, WithId} from "mongodb";
import {CommentInputModel} from "../../../models/commentTypes";
import {CommentDbTypes, CommentModel} from "../../../db/comment-type";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository  {
    async createComment(newComment: CommentDbTypes): Promise<string> {
        const result = await CommentModel.create(newComment);
        return result._id.toString();
    }

    async updateComment(id: string, input: CommentInputModel): Promise<boolean> {
        const result = await CommentModel.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content: input.content } } // Обновляем только content
        );
        return result.modifiedCount === 1;
    }

    async getCommentById(commentId: string): Promise<WithId<CommentDbTypes>  | null> {
        return CommentModel.findById(commentId).lean();
    }

    async deleteComment(id: string) {
        const result = await CommentModel.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    async CommentExists(id: string): Promise<boolean> {
        const result = await CommentModel.exists({_id: new ObjectId(id)});
        return  !!result;
    }
}