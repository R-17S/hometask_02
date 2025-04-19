import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";


export const createBlogHandler = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel | null>) => {
    const newBlog = await blogsRepository.createBlog(req.body);
    const newBlogId = await blogsRepository.getBlogById(newBlog.toString());
    res.status(201).send(newBlogId);
};