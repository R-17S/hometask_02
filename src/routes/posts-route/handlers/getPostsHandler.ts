import {Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const getPostsHandler = (req:  Request, res: Response<PostViewModel[]>) => {
    const posts = postsRepositories.getAllPosts();
    res.status(200).send(posts);
};