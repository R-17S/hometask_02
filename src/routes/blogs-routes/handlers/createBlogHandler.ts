import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";
import {blogsQueryRepository} from "../repositories/blog-query-repository";


export const createBlogHandler = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel | null>) => {
    const newBlog = await blogsService.createBlog(req.body);
    const newBlogId = await blogsQueryRepository.getBlogById(newBlog.toString());
    res.status(201).send(newBlogId);
};