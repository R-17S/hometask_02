import {Request, Response} from "express";
import {blogsService} from "../blog-service";

export const deleteBlogHandler = async (req: Request<{id: string}>, res: Response) => {
    await blogsService.deleteBlog(req.params.id);
    res.sendStatus(204);
};