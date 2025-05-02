import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";


export const updateBlogHandler = async (req: Request<{id: string},{},BlogInputModel>, res: Response<BlogViewModel | null>) => {
    await blogsService.updateBlog(req.params.id, req.body);
    //const updatedBlog = await blogsRepository.getBlogById(req.params.id,);
    res.sendStatus(204)//.send(updatedBlog);
};