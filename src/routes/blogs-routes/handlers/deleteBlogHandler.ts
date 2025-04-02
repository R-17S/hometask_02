import {Request, Response} from "express";
import {blogsRepository} from "../blog-repositories";

export const deleteBlogHandler =  (req: Request<{id: string}>, res: Response) => {
    blogsRepository.deleteBlog(req.params.id);
    res.sendStatus(204);
};