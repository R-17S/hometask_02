import mongoose from "mongoose";
import {SETTINGS} from "../settings";


export type RequestLogDbType = {
    ip: string;
    url: string;
    date: Date;
};

const requestLogSchema = new mongoose.Schema<RequestLogDbType>({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true },
});

export const RequestLogModel = mongoose.model<RequestLogDbType>(SETTINGS.DB.COLLECTION.REQUESTLOGS, requestLogSchema);