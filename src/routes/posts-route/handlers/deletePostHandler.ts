import {Request, Response} from "express";
import {postsService} from "../post-service";

export const deletePostHandler = async (req:  Request<{id: string}>, res: Response) => {
    await postsService.deletePost(req.params.id)
    res.status(204).send();
};