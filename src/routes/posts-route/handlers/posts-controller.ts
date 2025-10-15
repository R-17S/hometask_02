import {inject, injectable} from "inversify";
import {NextFunction, Request, Response} from "express";
import {CommentInputModel, CommentInputQuery, CommentViewModel, CommentViewPaginated} from "../../../models/commentTypes";
import {CommentsService} from "../../comments-routes/comments-service";
import {CommentsQueryRepository} from "../../comments-routes/repositories/comments-query-repository";
import {PostInputModel, PostInputQuery, PostsViewPaginated, PostViewModel} from "../../../models/postTypes";
import {PostsService} from "../post-service";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {paginationQueryComment} from "../../../pagination/comment-pagination";
import {paginationQueryPost} from "../../../pagination/post-pagination";


@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) private postsService: PostsService,
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
        @inject(CommentsService) private commentsService: CommentsService,
        @inject(CommentsQueryRepository) private commentQueryRepository: CommentsQueryRepository,
    ) {}

    async createCommentByPostId(req: Request<{ postId: string }, {}, CommentInputModel>, res: Response<CommentViewModel | { error: string }>, next: NextFunction) {
        try {
            const newComment = await this.commentsService.createComment(req.body, req.params.postId, req.userId as string);
            const commentToView = await this.commentQueryRepository.getCommentByIdOrError(newComment.toString(), req.userId as string);
            res.status(201).json(commentToView);
        } catch (error) {
            next(error);
        }
    }

    async createPost(req: Request<{}, {}, PostInputModel>, res: Response<PostViewModel>, next: NextFunction) {
        try {
            const newPostId = await this.postsService.createPost(req.body);
            const newPost = await this.postsQueryRepository.getPostByIdOrError(newPostId);
            res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req: Request<{ id: string }>, res: Response<void>, next: NextFunction) {
        try {
            await this.postsService.deletePost(req.params.id)
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async getCommentsByPostId(req: Request<{postId: string}, {}, {}, CommentInputQuery>, res: Response<CommentViewPaginated>, next: NextFunction) {
        try {
            await this.postsService.checkPostExists(req.params.postId);
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryComment(req);
            const userId = req.userId as string;
            const commentByPostId = await this.commentQueryRepository.getCommentsByPostId(req.params.postId,
                {
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection
                },
                userId
            );

            res.status(200).json(commentByPostId);
        } catch (error) {
            next(error);
        }
    }

    async getPost(req: Request<{ id: string }>, res: Response<PostViewModel>, next: NextFunction) {
        try {
            const foundPost = await this.postsQueryRepository.getPostByIdOrError(req.params.id);
            res.status(200).send(foundPost);
        } catch (error) {
            next(error);
        }
    }

    async getPosts(req: Request<{}, {}, {}, PostInputQuery>, res: Response<PostsViewPaginated>, next: NextFunction) {
        try {
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryPost(req);
            const posts = await this.postsQueryRepository.getAllPosts({
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            });
            res.status(200).send(posts);
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req: Request<{ id: string }, {}, PostInputModel>, res: Response<void>, next: NextFunction) {
        try {
            await this.postsService.updatePost(req.params.id, req.body);
            res.sendStatus(204)//.json(isUpdate);
        } catch (error) {
            next(error);
        }
    }
}


