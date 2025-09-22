import {SessionDbType} from "../../../db/session-type";
import {sessionsCollection} from "../../../db/mongoDB";
import {injectable} from "inversify";


@injectable()
export class SessionsRepository  {
    async createSession(session: SessionDbType): Promise<void> {
        await sessionsCollection.insertOne(session);
    }

    async findSession(userId: string, deviceId: string): Promise<SessionDbType | null> {
        return sessionsCollection.findOne({ userId, deviceId });
    }

    async updateSessionActivity(deviceId: string, date: Date): Promise<void> {
        await sessionsCollection.updateOne(
            { deviceId },
            { $set: { lastActiveDate: date } }
        );
    }

    async deleteSession(userId: string, deviceId: string): Promise<void> {
        await sessionsCollection.deleteOne({ userId, deviceId });
    }
}