import {injectable} from "inversify";
import {CommentLikeModel, LikeStatusDbTypes} from "../../../db/commentLikeDb-type";
import {CommentModel} from "../../../db/comment-type";


@injectable()
export class CommentLikeRepository {
    async find (userId: string, commentId: string) {
        return CommentLikeModel.findOne({userId, commentId})
    }

    async save (userId: string, commentId: string, status: LikeStatusDbTypes) {
        await CommentLikeModel.findOneAndUpdate(
            {userId, commentId},
            {status, updatedAt: new Date()},
            {upsert: true, new: true}// что бы не забыть сомнительные поля, но ОК upsert создаст док,если его нет, new вернёт новый
        );
        console.log('Saving like:', { userId, commentId, status });
    }

    async count (commentId: string, status: LikeStatusDbTypes): Promise<number> {
        return CommentLikeModel.countDocuments({commentId, status})
    }

    async updateLikeCounts(commentId: string, likesCount: number, dislikesCount: number): Promise<void> {
        await CommentModel.updateOne({_id: commentId}, {$set: {likesCount, dislikesCount}})
    }

    async delete (userId: string, commentId: string) {
        return CommentLikeModel.deleteOne({userId, commentId})
    }
}
