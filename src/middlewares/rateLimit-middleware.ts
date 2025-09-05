import {Request, Response, NextFunction} from "express";
import {requestLogsCollection} from "../db/mongoDB";



export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = typeof req.ip === 'string' ? req.ip : 'unknown';
    const url = req.originalUrl;
    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 10_000);

    await requestLogsCollection.insertOne({ip, url, date});

    // вероятно таким образом можно посчитать количество
    const recentRequest = await requestLogsCollection.countDocuments({ip, url, date: { $gte: tenSecondsAgo }});
    if (recentRequest > 5) {
        res.status(429).send('Too many requests')
        return
    }

    next();
}