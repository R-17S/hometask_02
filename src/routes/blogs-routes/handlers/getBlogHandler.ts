import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";

export const getBlogHandler = (req: Request<{id: string}>, res: Response<BlogViewModel>) => {
    const foundBlog = blogsRepository.getBlogById(req.params.id);
    res.status(200).send(foundBlog);
};