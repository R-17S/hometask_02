import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";


export const createBlogHandler = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel | null>) => {
    const newBlogId = await blogsRepository.createBlog(req.body);
    const newBlog = await blogsRepository.getBlogById(newBlogId.toString());
    res.status(201).send(newBlog);
};