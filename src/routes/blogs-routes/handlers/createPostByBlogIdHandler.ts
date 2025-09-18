import {NextFunction, Request, Response} from 'express';
import {PostByBlogIdInputModel, PostViewModel} from "../../../models/postTypes";
import {inject, injectable} from "inversify/lib/esm";


@injectable()
export class BlogsController {
    constructor(
        @inject(PostsService) private postsService: PostsService,
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository
    ) {}

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
}