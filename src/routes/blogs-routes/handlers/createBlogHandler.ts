import {NextFunction, Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {BlogsService} from "../blog-service";
import {BlogsQueryRepository} from "../repositories/blog-query-repository";
import {injectable, inject} from "inversify/lib/esm";



@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) private blogsService: BlogsService,
        @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository
    ) {}

    async createBlog(req: Request<{}, {}, BlogInputModel>, res: Response<BlogViewModel>, next: NextFunction) {
        try {
            const newBlogId = await this.blogsService.createBlog(req.body);
            const blogView = await this.blogsQueryRepository.getBlogByIdOrError(newBlogId.toString());
            res.status(201).json(blogView);
        } catch (error) {
            next(error);
        }
    }
}