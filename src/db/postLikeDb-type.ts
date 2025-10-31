import mongoose, {HydratedDocument, Model} from "mongoose";
import {SETTINGS} from "../settings";
import {CommentModel} from "./comment-type";
import {PostModel} from "./post-type";


export enum LikeStatusDbTypes {
    Like = 'Like',
    Dislike = 'Dislike',
}

type MyLikeStatusTypes = 'Like' | 'Dislike' | 'None';


export type PostLikeDbTypes = {
    userId: string;
    postId: string;
    status: LikeStatusDbTypes;
    updatedAt: Date;
}

type PostLikeMethods = typeof postLikeMethods;
type PostLikeStatics = typeof postLikeStatics;

export type PostLikeDocument = HydratedDocument<PostLikeDbTypes, PostLikeMethods>;
export type PostLikeModelType = Model<PostLikeDbTypes, {}, PostLikeMethods> & PostLikeStatics;


const PostLikeSchema = new mongoose.Schema<PostLikeDbTypes, PostLikeModelType, PostLikeMethods>({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    status: {type: String, enum: LikeStatusDbTypes, required: true},
    updatedAt: {type: Date, required: true},
});

const postLikeMethods = {
    // isLike(): boolean {
    //     return PostLikeDocument.status === LikeStatusDbTypes.Like;
    //     },
    // isDislike(this: PostLikeDocument): boolean {
    //     return this.status === LikeStatusDbTypes.Dislike;
    //     },
    // isSameStatus(this: PostLikeDocument, status: MyLikeStatusTypes): boolean {
    //     return this.status === status;
    //     },

    // isLike(this: PostLikeDocument) {
    //     return this.status === LikeStatusDbTypes.Like;
    // },
    //
    // isDislike(this: PostLikeDocument) {
    //     return this.status === LikeStatusDbTypes.Dislike;
    // },
};

const postLikeStatics = {

    // async findByUserAndPost(userId: string, postId: string) {
    //     return PostLikeModel.findOne({ userId, postId });
    // },
    //
    // async deleteByUserAndPost(userId: string, postId: string) {
    //     return PostLikeModel.deleteOne({ userId, postId });
    // },

    async updateStatus(userId: string, postId: string, status: MyLikeStatusTypes) {
        const existing = await PostLikeModel.findOne({ userId, postId });

        if (status === 'None') {
            if (existing) {
                await PostLikeModel.deleteOne({userId, postId});
            }
            return;
        }

        if (existing) {
            if (existing.status === status) return;
            existing.status = status as LikeStatusDbTypes;
            existing.updatedAt = new Date();
            return existing.save();
        }


        return PostLikeModel.create({ userId, postId, status, updatedAt: new Date() });
    },

    async getMyStatus(userId: string, postId: string): Promise<'Like' | 'Dislike' | 'None'> {
        const state = await PostLikeModel.findOne({ userId, postId });
        return state?.status ?? 'None';
    },

    //async countByStatus(postId: string, status: LikeStatusDbTypes) {
    //     return PostLikeModel.countDocuments({ postId, status });
    // },

    //тут решил разделить лайки и дизлайки по непонятным мне причинам
    // async getLikesCount(postId: string): Promise<{likesCount: number, dislikesCount: number}> {
    //     const likesCount = await PostLikeModel.countDocuments({postId, status: LikeStatusDbTypes.Like});
    //     const dislikesCount = await PostLikeModel.countDocuments({postId, status: LikeStatusDbTypes.Like});
    //     return {likesCount, dislikesCount};
    // }

    async getLikesCount(postId: string): Promise<number> {
        return  PostLikeModel.countDocuments({postId, status: LikeStatusDbTypes.Like});
    },

    async getDislikesCount(postId: string): Promise<number> {
        return  PostLikeModel.countDocuments({postId, status: LikeStatusDbTypes.Dislike});
    },

    // мне не нравиться что тут я мутирую пост модель с другой модели
    async updateLikeCounts(postId: string, likesCount: number, dislikesCount: number): Promise<void> {
        await PostModel.updateOne({_id: postId}, {$set: {likesCount, dislikesCount}})
    }
};

PostLikeSchema.methods = postLikeMethods;
PostLikeSchema.statics = postLikeStatics;

export const PostLikeModel = mongoose.model<PostLikeDbTypes, PostLikeModelType>(SETTINGS.DB.COLLECTION.POSTLIKES, PostLikeSchema);