import {Request, Response, NextFunction} from 'express';
import {jwtService} from "../application/jwt-service";
import {tokenRepository} from "../repositories/token-repositories";
import {sessionsRepository} from "../repositories/session-repositories";


export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction)=> {
    const refreshToken = req.refreshToken!;
    const payload  = await jwtService.getPayloadFromToken(refreshToken);

    if (!payload ) {
        res.status(401).send('Not authorized');
        return
    }
    const { userId, deviceId } = payload;

    const isRevoked = await tokenRepository.exists(refreshToken);
    if (isRevoked) {
        res.status(401).json({ message: 'Refresh token has been revoked' });
        return
    }

    const session = await sessionsRepository.findSession(userId, deviceId);
    if (!session) {
        res.status(401).json({ message: 'Session not found' });
        return
    }

    req.userId = userId;
    req.deviceId = deviceId;
    next();
}



