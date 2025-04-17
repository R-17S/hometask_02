import {ObjectId} from "mongodb";

export type PostDbTypes = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    //createdAt: Date;
}