import {Request, Response, NextFunction} from 'express';
import {jwtService} from "../application/jwt-service";
import {sessionsRepository} from "../repositories/session-repositories";


export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction)=> {
    const refreshToken = req.refreshToken!;
    const payload  = await jwtService.getPayloadFromToken(refreshToken);

    if (!payload ) {
        res.status(401).send('Not authorized');
        return
    }
    const { userId, deviceId } = payload;
    const session = await sessionsRepository.findSession(userId, deviceId);
    if (!session) {
        res.status(401).json({ message: 'Session not found' });
        return
    }

    const decode = await jwtService.decodeToken(refreshToken);
    const tokenIat = new Date(decode.iat * 1000)
    if (tokenIat.getTime() !== session.lastActiveDate.getTime()) {
        res.status(401).json({ message: 'Token reuse detected' });
        return;
    }

    //req.userId = userId;
    //req.deviceId = deviceId; //спроси падла не ЗАБУДЬ НУЖНО ЛИ РАЗГРУЗИТЬ СЕРВИС ОТ ЭТОГО ИЛИ НЕТ !!!
    next();
}



