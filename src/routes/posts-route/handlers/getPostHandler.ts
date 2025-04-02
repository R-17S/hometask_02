import {Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const getPostHandler = (req:  Request<{id: string}>, res: Response<PostViewModel>) => {
    const foundPost = postsRepositories.getPostById(req.params.id);
    res.status(200).send(foundPost);
};