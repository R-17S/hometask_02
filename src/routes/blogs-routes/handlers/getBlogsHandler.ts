import {NextFunction, Request, Response} from "express";
import {BlogInputQuery, BlogsViewPaginated} from "../../../models/blogTypes";
import {BlogsQueryRepository} from "../repositories/blog-query-repository";
import {paginationQueryBlog} from "../../../pagination/blog-pagination";
import {inject, injectable} from "inversify/lib/esm";


@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository
    ) {}

    async getBlogs(req: Request<{}, {}, {}, BlogInputQuery>, res: Response<BlogsViewPaginated>, next: NextFunction) {
        try {
            const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = paginationQueryBlog(req);
            const blogs = await this.blogsQueryRepository.getAllBlogs({
                searchNameTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            });
            res.status(200).send(blogs);
        } catch (error) {
            next(error);
        }
    }
};