import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type LikeStatusTypes = 'Like' | 'Dislike';

export type CommentLikeDbTypes = {
    userId: string;
    commentId: string;
    status: LikeStatusTypes;
    updatedAt: Date;
}

const CommentLikeSchema = new mongoose.Schema<CommentLikeDbTypes>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    status: {type: String, enum: ['Like', 'Dislike'], required: true},
    updatedAt: {type: Date, required: true},
})

export const CommentLikeModel = mongoose.model<CommentLikeDbTypes>(SETTINGS.DB.COLLECTION.COMMENTLIKES, CommentLikeSchema);