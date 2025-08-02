import {NextFunction, Request, Response} from "express";
import {blogsService} from "../blog-service";

export const deleteBlogHandler = async (req: Request<{id: string}>, res: Response<void>, next:NextFunction) => {
    try {
        await blogsService.deleteBlog(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};