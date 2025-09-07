import {NextFunction, Request, Response,} from "express";
import {jwtService} from "../application/jwt-service";



export const authJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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