import {NextFunction, Request, Response} from "express";
import {postsService} from "../post-service";

export const deletePostHandler = async (req:  Request<{id: string}>, res: Response, next:NextFunction) => {
    try {
        await postsService.deletePost(req.params.id)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};