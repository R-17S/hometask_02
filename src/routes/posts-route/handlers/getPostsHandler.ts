import {Request, Response} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";

export const getPostsHandler = async (req:  Request, res: Response<PostViewModel[]>) => {
    const posts = await postsRepositories.getAllPosts();
    res.status(200).send(posts);
};