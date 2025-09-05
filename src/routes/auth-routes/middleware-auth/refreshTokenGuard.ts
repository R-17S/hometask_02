import {Request, Response, NextFunction} from 'express';
import {jwtService} from "../application/jwt-service";
import {tokenRepository} from "../repositories/token-repositories";


export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction)=> {
    const refreshToken = req.refreshToken!;
    const userId = await jwtService.getUserIdFromToken(refreshToken);

    if (!userId) {
        res.status(401).send('Not authorized');
        return
    }

    const isRevoked = await tokenRepository.exists(refreshToken);
    if (isRevoked) {
        res.status(401).json({ message: 'Refresh token has been revoked' });
        return
    }
    req.userId = userId;
    next();
}



