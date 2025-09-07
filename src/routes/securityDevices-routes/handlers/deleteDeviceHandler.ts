import {NextFunction, Request, Response} from 'express';
import {BadRequestException, ForbiddenException} from "../../../helper/exceptions";
import {sessionsQueryRepository} from "../repositories/session-query-repositories";


export const deleteDeviceHandler = async (req: Request<{deviceId: string}>, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const currentDeviceId = req.deviceId!;
        const targetDeviceId = req.params.deviceId;

        if (currentDeviceId === targetDeviceId) throw new BadRequestException('Cannot delete current device session')

        const sessionUserId = await sessionsQueryRepository.findByDeviceIdOrError(targetDeviceId);
        if (sessionUserId !== userId) throw new ForbiddenException('Access denied: device does not belong to user');
        await sessionsQueryRepository.deleteByDeviceId( targetDeviceId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}