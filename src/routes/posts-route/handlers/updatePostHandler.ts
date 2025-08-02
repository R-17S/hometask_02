import {NextFunction, Request, Response} from "express";
import {PostInputModel} from "../../../models/postTypes";
import {postsService} from "../post-service";

export const updatePostHandler = async (req:  Request<{id: string},{},PostInputModel>, res: Response<void>, next:NextFunction) => {
    try {
        await postsService.updatePost(req.params.id, req.body);
        res.sendStatus(204)//.json(isUpdate);
    } catch (error) {
        next(error);
    }
};