import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const createPostHandler = async (req:  Request<{},{},PostInputModel>, res: Response<PostViewModel | null>) => {
    const newPost = await postsRepositories.createPost(req.body);
    if (!newPost) return undefined
    const newPostId = await postsRepositories.getPostById(newPost.toString());
    // if (!newPost) return res.sendStatus(400);
    res.status(201).json(newPostId);
};