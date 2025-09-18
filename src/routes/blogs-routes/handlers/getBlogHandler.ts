import {NextFunction, Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {BlogsQueryRepository} from "../repositories/blog-query-repository";
import {inject, injectable} from "inversify/lib/esm";


@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository
    ) {}

    async getBlogHandler (req: Request<{ id: string }>, res: Response<BlogViewModel>, next: NextFunction) {
        try {
            const foundBlog = await this.blogsQueryRepository.getBlogByIdOrError(req.params.id);
            res.status(200).send(foundBlog);
        } catch (error) {
            next(error);
        }
    }
}