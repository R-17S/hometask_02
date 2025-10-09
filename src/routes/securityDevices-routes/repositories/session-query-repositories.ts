
import {WithId} from "mongodb";
import {SessionDbType, SessionModel} from "../../../db/session-type";
import {SessionViewModel} from "../../../models/sessionType";
import {NotFoundException} from "../../../helper/exceptions";
import {injectable} from "inversify";

@injectable()
export class SessionsQueryRepository  {
    async getSessionsByUserId(userId: string): Promise<SessionViewModel[]> {
        const session = await SessionModel.find({ userId }).lean();
        return session.map(this.mapToSessionViewModel)
    }

    mapToSessionViewModel(session: WithId<SessionDbType>): SessionViewModel {
        return {
            ip: session.ip,
            title: session.deviceTitle ?? 'Unknown device',
            lastActiveDate: session.lastActiveDate.toISOString(),
            deviceId: session.deviceId
        };
    }

    async deleteAllExcept(userId: string, excludeDeviceId: string): Promise<void> {
        await SessionModel.deleteMany({userId, deviceId: {$ne : excludeDeviceId}})
    }

    async findByDeviceIdOrError(deviceId: string): Promise<string> {
        const session = await SessionModel.findOne({ deviceId }).lean();
        if (!session) throw new NotFoundException('Device session not found');
        return session.userId
    }

    async deleteByDeviceId(deviceId: string): Promise<void> {
        await SessionModel.deleteOne({ deviceId });
    }

}