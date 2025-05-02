import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";


export const createBlogHandler = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel | null>) => {
    const newBlog = await blogsService.createBlog(req.body);
    const newBlogId = await blogsService.getBlogById(newBlog.toString());
    res.status(201).send(newBlogId);
};