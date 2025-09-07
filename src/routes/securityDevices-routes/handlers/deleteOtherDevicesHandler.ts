import {Request, Response, NextFunction} from "express";
import {sessionsQueryRepository} from "../repositories/session-query-repositories";


export const  deleteOtherDevicesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const currentDeviceId = req.deviceId!;
        await sessionsQueryRepository.deleteAllExcept(userId, currentDeviceId);
        res.sendStatus(204);
        return
    } catch (error) {
        next(error);
    }
}