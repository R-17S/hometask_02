import {Request, Response} from "express";
import {postsRepositories} from "../post-repositories";

export const deletePostHandler = async (req:  Request<{id: string}>, res: Response) => {
    await postsRepositories.deletePost(req.params.id)
    res.status(204).send();
};