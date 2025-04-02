import {Request, Response} from "express";
import {postsRepositories} from "../post-repositories";

export const deletePostHandler = (req:  Request<{id: string}>, res: Response) => {
    postsRepositories.deletePost(req.params.id)
    res.status(204).send();
};