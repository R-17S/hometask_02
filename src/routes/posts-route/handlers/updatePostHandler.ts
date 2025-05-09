import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsService} from "../post-service";

export const updatePostHandler = async (req:  Request<{id: string},{},PostInputModel>, res: Response<PostViewModel | null>) => {
    await postsService.updatePost(req.params.id, req.body);
    res.sendStatus(204)//.json(isUpdate);
};