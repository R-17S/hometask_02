import {Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const getPostHandler = async (req:  Request<{id: string}>, res: Response<PostViewModel | null>) => {
    const foundPost = await postsRepositories.getPostById(req.params.id);
    res.status(200).send(foundPost);
};