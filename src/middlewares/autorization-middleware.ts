import {NextFunction, Request, Response} from "express";


export const admin_Username = process.env.ADMIN_USERNAME || 'admin';
export const admin_Password = process.env.ADMIN_PASSWORD || 'qwerty';

export const authMiddleware =  (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;
    if (!auth) {
        res.status(401).send('Not authorized');
        return;
    }

    const [authType, token] = auth.split(' ');
    if (authType !== "Basic") {
        res.status(401).send('Not authorized');
        return;
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== admin_Username || password !== admin_Password) {
        res.status(401).send('Not authorized');
        return;
    }
    next();
};