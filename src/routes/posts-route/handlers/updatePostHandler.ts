import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const updatePostHandler = (req:  Request<{id: string},{},PostInputModel>, res: Response<PostViewModel>) => {
    const isUpdate = postsRepositories.updatePost(req.params.id, req.body);
    res.status(204).json(isUpdate);
};