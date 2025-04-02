import {Request, Response} from "express";
import {PostInputModel, PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const createPostHandler =(req:  Request<{},{},PostInputModel>, res: Response<PostViewModel>) => {
    const newPost = postsRepositories.createPost(req.body);
    res.status(201).send(newPost);
};