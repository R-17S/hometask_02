import {ObjectId} from "mongodb";
import {PostModel} from "../../../db/post-type";
import {injectable} from "inversify";

import {CommentModel} from "../../../db/comment-type";
import {PostLikeModel} from "../../../db/postLikeDb-type";
import {LikeStatusDbTypes} from "../../../db/postLikeDb-type";
import {MyLikeStatusTypes} from "../../../models/commentTypes";




@injectable()
export class PostsRepository {
    async save(post: InstanceType<typeof PostModel>): Promise<void> {
        await post.save();
    }

    // InstanceType это тип такого экземпляра, нельзя тут всунуть простой тип (Это plain object — просто описание полей, без поведения, без методов,)
    async findById(id: string): Promise<InstanceType<typeof PostModel> | null>  {
        return PostModel.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async exists(id: string): Promise<boolean> {
        return !!(await PostModel.exists({_id: new ObjectId(id)}));
    }

    async findLikes (userId: string, postId: string) {
        return PostLikeModel.findOne({userId, postId})
    }

    // async findManyLikes (userId: string, postId: string[]) {
    //     return PostModel.find({
    //         userId,
    //         commentId: { $in: postId }
    //     }).lean();
    // }
    //
    // async saveLikes (userId: string, postId: string, status: LikeStatusDbTypes) {
    //     await PostModel.findOneAndUpdate(
    //         {userId, postId},
    //         {status, updatedAt: new Date()},
    //         {upsert: true, new: true}// что бы не забыть сомнительные поля, но ОК upsert создаст док,если его нет, new вернёт новый
    //     );
    //     console.log('Saving like:', { userId, postId, status });
    // }

    async upsert(userId: string, postId: string, status: MyLikeStatusTypes) {
        return PostLikeModel.updateStatus(userId, postId, status);
    }

    // async countLikes (commentId: string, status: LikeStatusDbTypes): Promise<number> {
    //     return PostModel.countDocuments({commentId, status})
    // }

    async getMyStatus(userId: string, postId: string) {
        return PostLikeModel.getMyStatus(userId, postId);
    }

    async updateLikeCounts(postId: string, likesCount: number, dislikesCount: number): Promise<void> {
        await PostLikeModel.updateLikeCounts(postId, likesCount, dislikesCount)
    }

    async deleteLikes (userId: string, postId: string) {
        return PostLikeModel.deleteOne({userId, postId})
    }

    async getLikesCount(postId: string) {
        return PostLikeModel.getLikesCount(postId);
    }

    async getDislikesCount(postId: string) {
        return PostLikeModel.getDislikesCount(postId);
    }

    // async saveLike(userId: string, postId: string, status: LikeStatusDbTypes) {
    //     return PostLikeModel.saveStatus(userId, postId, status);
    // }
    //
    // async deleteLike(userId: string, postId: string) {
    //     return PostLikeModel.deleteByUserAndPost(userId, postId);
    // }
    //
    // async findLike(userId: string, postId: string) {
    //     return PostLikeModel.findByUserAndPost(userId, postId);
    // }
    //
    // async countLike(postId: string, status: LikeStatusDbTypes) {
    //     return PostLikeModel.countByStatus(postId, status);
    // }
}