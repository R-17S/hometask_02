import {Request, Response} from "express";
import {blogsRepository} from "../blog-repositories";

export const deleteBlogHandler = async (req: Request<{id: string}>, res: Response) => {
    await blogsRepository.deleteBlog(req.params.id);
    res.sendStatus(204);
};