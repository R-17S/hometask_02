import {NextFunction, Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsQueryRepository} from "../repositories/posts-query-repository";
import {postsService} from "../post-service";

export const createPostHandler = async (req:  Request<{},{},PostInputModel>, res: Response<PostViewModel>, next:NextFunction) => {
    try {
        const newPost = await postsService.createPost(req.body);
        const newPostId = await postsQueryRepository.getPostByIdOrError(newPost.toString());
        res.status(201).json(newPostId);
    } catch (error) {
        next(error);
    }
};
