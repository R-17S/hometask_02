
import dotenv from 'dotenv';
import {SETTINGS} from "../settings";
import * as mongoose from "mongoose";
dotenv.config();




export async function runDb(mongoURI: string): Promise<boolean> {
    try {
        await mongoose.connect(SETTINGS.MONGO_URL || mongoURI);
        console.log('Connected to MongoDB via Mongoose')
        return true;
    } catch (error) {
        console.error('Mongoose connection failed:', error);
        await mongoose.disconnect()
        return false;
    }
}


