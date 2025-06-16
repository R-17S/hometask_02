import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsQueryRepository} from "../repositories/posts-query-repository";
import {postsService} from "../post-service";

export const createPostHandler = async (req:  Request<{},{},PostInputModel>, res: Response<PostViewModel | null>) => {
    const newPost = await postsService.createPost(req.body);
    if (!newPost) return undefined
    const newPostId = await postsQueryRepository.getPostById(newPost.toString());
    // if (!newPost) return res.sendStatus(400);
    res.status(201).json(newPostId);
};