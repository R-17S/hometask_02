import {Request, Response, NextFunction} from "express";
import {RequestLogModel} from "../db/requestDbType";



export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = typeof req.ip === 'string' ? req.ip : 'unknown';
    const url = req.originalUrl;
    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 10_000);

    // вероятно таким образом можно посчитать количество
    const recentRequest = await RequestLogModel.countDocuments({ip, url, date: { $gte: tenSecondsAgo }});
    if (recentRequest >= 5) {
        res.status(429).send('Too many requests')
        return
    }
    await RequestLogModel.insertOne({ip, url, date});

    next();
}