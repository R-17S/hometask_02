import {blogsRepository} from "../blog-repositories";
import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";

export const getBlogsHandler = async (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs = await blogsRepository.getAllBlogs();
    res.status(200).json(blogs);
}