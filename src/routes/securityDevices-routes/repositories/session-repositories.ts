import {SessionDbType, SessionModel} from "../../../db/session-type";
import {injectable} from "inversify";



@injectable()
export class SessionsRepository  {
    async createSession(session: SessionDbType): Promise<void> {
        await SessionModel.create(session);
    }

    async getSession(userId: string, deviceId: string): Promise<SessionDbType | null> {
        return SessionModel.findOne({ userId, deviceId });
    }

    async updateSessionActivity(deviceId: string, date: Date): Promise<void> {
        await SessionModel.updateOne(
            { deviceId },
            { $set: { lastActiveDate: date } }
        );
    }

    async deleteSession(userId: string, deviceId: string): Promise<void> {
        await SessionModel.deleteOne({ userId, deviceId });
    }
}