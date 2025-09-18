import {inject, injectable} from "inversify/lib/esm";
import {BlogsService} from "../blog-service";
import {BlogsQueryRepository} from "../repositories/blog-query-repository";
import {NextFunction, Request, Response} from "express";
import {BlogInputModel, BlogInputQuery, BlogsViewPaginated, BlogViewModel} from "../../../models/blogTypes";
import {PostByBlogIdInputModel, PostInputQuery, PostsViewPaginated, PostViewModel} from "../../../models/postTypes";
import {paginationQueryBlog} from "../../../pagination/blog-pagination";
import {paginationQueryPost} from "../../../pagination/post-pagination";
import {PostsService} from "../../posts-route/post-service";
import {PostsQueryRepository} from "../../posts-route/repositories/posts-query-repository";


@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) private blogsService: BlogsService,
        @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsService) private postsService: PostsService,
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository
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

    async createPostByBlogId(req: Request<{
        blogId: string
    }, {}, PostByBlogIdInputModel>, res: Response<PostViewModel>, next: NextFunction) {
        try {
            const newPost = await this.postsService.createPost(req.body, req.params.blogId);
            const newPostId = await this.postsQueryRepository.getPostByIdOrError(newPost.toString());
            res.status(201).json(newPostId);
        } catch (error) {
            next(error)
        }
    }

    async  deleteBlogById (req: Request<{id: string}>, res: Response<void>, next:NextFunction) {
        try {
            await this.blogsService.deleteBlog(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async getBlogById (req: Request<{ id: string }>, res: Response<BlogViewModel>, next: NextFunction) {
        try {
            const foundBlog = await this.blogsQueryRepository.getBlogByIdOrError(req.params.id);
            res.status(200).send(foundBlog);
        } catch (error) {
            next(error);
        }
    }

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

    //дуюлируется название, а как назвать тогда
    async getPostsByBlogId(req: Request<{blogId: string}, {}, {}, PostInputQuery>, res: Response<PostsViewPaginated>, next: NextFunction) {
        try {
            await this.blogsService.checkBlogExists(req.params.blogId);
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryPost(req);
            const postByBlogId = await this.postsQueryRepository.getPostsByBlogId(req.params.blogId,
                {
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection,
                }
            );

            res.status(200).send(postByBlogId)
        } catch (error) {
            next(error);
        }
    }

    async updateBlog(req: Request<{ id: string }, {}, BlogInputModel>, res: Response<void>, next: NextFunction) {
        try {
            await this.blogsService.updateBlog(req.params.id, req.body);
            //const updatedBlog = await blogsRepository.getBlogById(req.params.id,);
            res.sendStatus(204)//.send(updatedBlog);
        } catch (error) {
            next(error);
        }
    }
}


