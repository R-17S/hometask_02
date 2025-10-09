import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type CommentDbTypes = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    createdAt: Date;
    likesCount?: number,
    dislikesCount?: number,
};

const commentSchema = new mongoose.Schema<CommentDbTypes>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 }
});

export const CommentModel = mongoose.model<CommentDbTypes>(SETTINGS.DB.COLLECTION.COMMENTS, commentSchema);