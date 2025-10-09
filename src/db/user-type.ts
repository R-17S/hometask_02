import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type UserDbTypes = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    emailConfirmation?: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
    passwordRecovery?: {
        recoveryCode: string;
        expirationDate: Date;
    }
};

const userSchema = new mongoose.Schema<UserDbTypes>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, required: true },
    emailConfirmation: {
        confirmationCode: { type: String },
        expirationDate: { type: Date },
        isConfirmed: { type: Boolean },
    },
    passwordRecovery: {
        recoveryCode: { type: String },
        expirationDate: { type: Date },
    },
});

export const UserModel = mongoose.model<UserDbTypes>(SETTINGS.DB.COLLECTION.USERS, userSchema);