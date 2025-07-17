import {NextFunction, Request, Response} from "express";
import {BlogInputModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";


export const updateBlogHandler = async (req: Request<{id: string},{},BlogInputModel>, res: Response<void>, next:NextFunction) => {
    try {
        await blogsService.updateBlog(req.params.id, req.body);
        //const updatedBlog = await blogsRepository.getBlogById(req.params.id,);
        res.sendStatus(204)//.send(updatedBlog);
    } catch (error) {
        next(error);
    }
};
