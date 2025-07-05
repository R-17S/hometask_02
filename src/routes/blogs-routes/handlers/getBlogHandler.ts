import {NextFunction, Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../repositories/blog-query-repository";

export const getBlogHandler = async (req: Request<{id: string}>, res: Response<BlogViewModel>, next:NextFunction) => {
    try {
        const foundBlog = await blogsQueryRepository.getBlogByIdOrError(req.params.id);
        res.status(200).json(foundBlog);
    } catch (error) {
        next(error);
    }
};