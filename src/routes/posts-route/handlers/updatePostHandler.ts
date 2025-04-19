import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const updatePostHandler = async (req:  Request<{id: string},{},PostInputModel>, res: Response<PostViewModel | null>) => {
    await postsRepositories.updatePost(req.params.id, req.body);
    res.sendStatus(204)//.json(isUpdate);
};