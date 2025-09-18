import {NextFunction, Request, Response} from "express";
import {BlogsService} from "../blog-service";
import {injectable, inject} from "inversify";




@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) private blogsService: BlogsService,
    ) {}
    async  deleteBlogById (req: Request<{id: string}>, res: Response<void>, next:NextFunction) {
        try {
            await this.blogsService.deleteBlog(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}