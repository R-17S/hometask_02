import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";


export const updateBlogHandler = (req: Request<{id: string},{},BlogInputModel>, res: Response<BlogViewModel>) => {
    const isUpdated = blogsRepository.updateBlog(req.params.id, req.body);
    const updatedBlog = blogsRepository.getBlogById(req.params.id);
    res.status(204).send(updatedBlog);
};