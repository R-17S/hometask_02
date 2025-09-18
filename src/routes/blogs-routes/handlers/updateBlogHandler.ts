import {NextFunction, Request, Response} from "express";
import {BlogInputModel} from "../../../models/blogTypes";
import {BlogsService} from "../blog-service";
import {inject, injectable} from "inversify/lib/esm";
import {BlogsQueryRepository} from "../repositories/blog-query-repository";


@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) private blogsService: BlogsService
    ) {}

    async updateBlogHandler(req: Request<{ id: string }, {}, BlogInputModel>, res: Response<void>, next: NextFunction) {
        try {
            await this.blogsService.updateBlog(req.params.id, req.body);
            //const updatedBlog = await blogsRepository.getBlogById(req.params.id,);
            res.sendStatus(204)//.send(updatedBlog);
        } catch (error) {
            next(error);
        }
    }
}
