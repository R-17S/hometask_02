import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";


export const createBlogHandler = (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlog = blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
};