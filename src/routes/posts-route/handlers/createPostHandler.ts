import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postQueryRepository} from "../repositories/post-query-repository";
import {postsService} from "../post-service";

export const createPostHandler = async (req:  Request<{},{},PostInputModel>, res: Response<PostViewModel | null>) => {
    const newPost = await postsService.createPost(req.body);
    if (!newPost) return undefined
    const newPostId = await postQueryRepository.getPostById(newPost.toString());
    // if (!newPost) return res.sendStatus(400);
    res.status(201).json(newPostId);
};