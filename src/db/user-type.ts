import {ObjectId} from "mongodb";


export type UserDbTypes = {
    _id: ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: Date;
}