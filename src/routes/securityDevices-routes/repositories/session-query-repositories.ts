import {sessionsCollection} from "../../../db/mongoDB";
import {WithId} from "mongodb";
import {SessionDbType} from "../../../db/session-type";
import {SessionViewModel} from "../../../models/sessionType";
import {NotFoundException} from "../../../helper/exceptions";


export const sessionsQueryRepository = {
    async findByUserId(userId: string): Promise<SessionViewModel[]> {
        const session = await sessionsCollection.find({ userId }).toArray();
        return session.map(this.mapToSessionViewModel)
    },

    mapToSessionViewModel(session: WithId<SessionDbType>): SessionViewModel {
        return {
            ip: session.ip,
            title: session.deviceTitle ?? 'Unknown device',
            lastActiveDate: session.lastActiveDate.toISOString(),
            deviceId: session.deviceId
        };
    },

    async deleteAllExcept(userId: string, excludeDeviceId: string): Promise<void> {
        await sessionsCollection.deleteMany({userId, deviceId: {$ne : excludeDeviceId}})
    },

    async findByDeviceIdOrError(deviceId: string): Promise<string> {
        const session = await sessionsCollection.findOne({ deviceId });
        if (!session) throw new NotFoundException('Device session not found');
        return session.userId
    },

    async deleteByDeviceId(deviceId: string): Promise<void> {
        await sessionsCollection.deleteOne({ deviceId });
    },

}