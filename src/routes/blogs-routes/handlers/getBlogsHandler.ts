import {blogsRepository} from "../blog-repositories";
import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";

export const getBlogsHandler = (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs = blogsRepository.getAllBlogs();
    res.status(200).send(blogs);
}