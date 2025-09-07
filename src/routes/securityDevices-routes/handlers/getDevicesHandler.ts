import {Request, Response, NextFunction} from "express";
import {sessionsQueryRepository} from "../repositories/session-query-repositories";


export const getDevicesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const session = await sessionsQueryRepository.findByUserId(userId);
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
}