import {NextFunction, Request, Response,} from "express";
import {jwtService} from "../application/jwt-service";



export const authJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Not authorized');
        return
    }

    const token = authHeader.split(' ')[1];
    const userId = await jwtService.getUserIdFromToken(token);

    if (!userId) {
        res.status(401).send('Not authorized');
        return
    }

    req.userId = userId;
    next();
}