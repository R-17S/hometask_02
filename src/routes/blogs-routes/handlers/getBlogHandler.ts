import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../repositories/blog-query-repository";

export const getBlogHandler = async (req: Request<{id: string}>, res: Response<BlogViewModel | null>) => {
    const foundBlog = await blogsQueryRepository.getBlogById(req.params.id);
    res.status(200).json(foundBlog);
};