import {NextFunction, Request, Response} from 'express';



export const checkRefreshTokenCookie = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).send('Not authorized');
        return
    }
    req.refreshToken = refreshToken;
    next();
};