import {Request, Response, NextFunction} from "express";


export const contextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    req.context = {
        ip: typeof req.ip === 'string' ? req.ip : 'unknown',
        userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : 'unknown device'
    };
    if (!req.context) {
        res.status(500).send('Request context not initialized');
        return
    }
    next();
}