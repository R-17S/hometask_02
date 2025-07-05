import {NextFunction, Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsQueryRepository} from "../repositories/posts-query-repository";

export const getPostHandler = async (req:  Request<{id: string}>, res: Response<PostViewModel>, next:NextFunction) => {
    try {
        const foundPost = await postsQueryRepository.getPostByIdOrError(req.params.id);
        res.status(200).send(foundPost);
    } catch (error) {
        next(error);
    }
};