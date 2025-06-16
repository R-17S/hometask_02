import {Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsQueryRepository} from "../repositories/posts-query-repository";

export const getPostHandler = async (req:  Request<{id: string}>, res: Response<PostViewModel | null>) => {
    const foundPost = await postsQueryRepository.getPostById(req.params.id);
    res.status(200).send(foundPost);
};