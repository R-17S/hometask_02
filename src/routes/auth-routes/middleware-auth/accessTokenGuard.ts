import {NextFunction, Request, Response,} from "express";
import {JwtService} from "../application/jwt-service";
import {container} from "../../../inversify.config";



const jwtService = container.get(JwtService);

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Not authorized');
        return
    }

    const token = authHeader.split(' ')[1];
    const payload  = await jwtService.getPayloadFromToken(token);

    if (!payload ) {
        res.status(401).send('Not authorized');
        return
    }

    req.userId = payload.userId;
    req.deviceId = payload.deviceId;
    next();
}