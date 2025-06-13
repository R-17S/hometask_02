import {ObjectId} from "mongodb";


export type CommentDbTypes = {
    _id: ObjectId;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
};