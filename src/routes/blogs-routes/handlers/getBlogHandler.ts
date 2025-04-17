import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";

export const getBlogHandler = async (req: Request<{id: string}>, res: Response<BlogViewModel | null>) => {
    const foundBlog = await blogsRepository.getBlogById(req.params.id);
    res.status(200).json(foundBlog);
};