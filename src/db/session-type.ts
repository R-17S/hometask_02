import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type SessionDbType = {
    userId: string;
    deviceId: string;
    ip: string;
    deviceTitle: string | undefined;
    issuedAt: Date;
    expiresAt: Date;
    lastActiveDate: Date;
}

const sessionSchema = new mongoose.Schema<SessionDbType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    deviceTitle: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    lastActiveDate: { type: Date, required: true },
});

export const SessionModel = mongoose.model<SessionDbType>(SETTINGS.DB.COLLECTION.SESSIONS, sessionSchema);


