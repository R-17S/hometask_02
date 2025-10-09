import {NextFunction, Request, Response} from 'express';
import {container} from "../../../inversify.config";
import {JwtService} from "../application/jwt-service";

const jwtService = container.get(JwtService);

export const optionalAccessAuthGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const payload =  await jwtService.getPayloadFromToken(token);
            req.userId = payload!.userId;
        } catch (err) {
        }
    }
    next();
};