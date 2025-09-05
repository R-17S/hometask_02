import {SessionDbType} from "../../../db/session-type";
import {sessionsCollection} from "../../../db/mongoDB";


export const sessionsRepository = {
    async createSession(session: SessionDbType): Promise<void> {
        await sessionsCollection.insertOne(session);
    }
};