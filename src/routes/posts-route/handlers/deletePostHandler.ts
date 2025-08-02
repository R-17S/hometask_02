import {NextFunction, Request, Response} from "express";
import {postsService} from "../post-service";

export const deletePostHandler = async (req:  Request<{id: string}>, res: Response<void>, next:NextFunction) => {
    try {
        await postsService.deletePost(req.params.id)
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};