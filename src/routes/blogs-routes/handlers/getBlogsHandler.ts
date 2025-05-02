import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";

export const getBlogsHandler = async (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs = await blogsService.getAllBlogs();
    res.status(200).json(blogs);
}