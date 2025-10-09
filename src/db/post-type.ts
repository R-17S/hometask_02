import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type PostDbTypes = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
};

const postSchema = new mongoose.Schema<PostDbTypes>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
})

export const PostModel = mongoose.model<PostDbTypes>(SETTINGS.DB.COLLECTION.POSTS, postSchema);