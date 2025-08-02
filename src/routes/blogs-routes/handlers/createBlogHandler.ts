import {NextFunction, Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";
import {blogsQueryRepository} from "../repositories/blog-query-repository";



export const createBlogHandler = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel>, next:NextFunction) => {
    try {
        const newBlog = await blogsService.createBlog(req.body);
        const newBlogId = await blogsQueryRepository.getBlogByIdOrError(newBlog.toString());
        res.status(201).json(newBlogId);
    } catch (error) {
        next(error);
    }
};