import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type BlogDbTypes = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

const BlogSchema = new mongoose.Schema<BlogDbTypes>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt:  {type: Date, required: true},
    isMembership: {type: Boolean, required: true},
})

export const BlogModel = mongoose.model<BlogDbTypes>(SETTINGS.DB.COLLECTION.BLOGS, BlogSchema)