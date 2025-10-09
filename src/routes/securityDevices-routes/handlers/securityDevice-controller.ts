import {inject, injectable} from "inversify";
import {NextFunction, Request, Response} from "express";
import {BadRequestException, ForbiddenException} from "../../../helper/exceptions";
import {SessionsQueryRepository} from "../repositories/session-query-repositories";


@injectable()
export class SecurityDeviceController {
    constructor(
        @inject(SessionsQueryRepository) private sessionsQueryRepository: SessionsQueryRepository,
    ) {
    }

    async deleteDevice(req: Request<{ deviceId: string }>, res: Response, next: NextFunction) {
        try {
            const userId = req.userId!;
            const currentDeviceId = req.deviceId!;
            const targetDeviceId = req.params.deviceId;

            if (currentDeviceId === targetDeviceId) throw new BadRequestException('Cannot delete current device session')

            const sessionUserId = await this.sessionsQueryRepository.findByDeviceIdOrError(targetDeviceId);
            if (sessionUserId !== userId) throw new ForbiddenException('Access denied: device does not belong to user');
            await this.sessionsQueryRepository.deleteByDeviceId(targetDeviceId);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async deleteOtherDevices(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId!;
            const currentDeviceId = req.deviceId!;
            await this.sessionsQueryRepository.deleteAllExcept(userId, currentDeviceId);
            res.sendStatus(204);
            return
        } catch (error) {
            next(error);
        }
    }

    async getDevices(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId!;
            const session = await this.sessionsQueryRepository.getSessionsByUserId(userId);
            res.status(200).json(session);
        } catch (error) {
            next(error);
        }
    }
}

