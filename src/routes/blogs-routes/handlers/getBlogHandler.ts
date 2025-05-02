import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";

export const getBlogHandler = async (req: Request<{id: string}>, res: Response<BlogViewModel | null>) => {
    const foundBlog = await blogsService.getBlogById(req.params.id);
    res.status(200).json(foundBlog);
};