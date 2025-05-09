import {Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postQueryRepository} from "../repositories/post-query-repository";

export const getPostHandler = async (req:  Request<{id: string}>, res: Response<PostViewModel | null>) => {
    const foundPost = await postQueryRepository.getPostById(req.params.id);
    res.status(200).send(foundPost);
};