import {inject, injectable} from "inversify";
import {CommentsService} from "../comments-service";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {NextFunction, Request, Response} from "express";
import {CommentInputModel, CommentViewModel, MyLikeStatusTypes} from "../../../models/commentTypes";


@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) private commentsService: CommentsService,
        @inject(CommentQueryRepository) private commentQueryRepository: CommentQueryRepository,
    ) {}

    async deleteComment(req: Request<{ commentId: string }>, res: Response, next: NextFunction) {
        try {
            const userId = req.userId as string;
            await this.commentsService.checkCommentOwnership(req.params.commentId, userId);
            await this.commentsService.deleteComment(req.params.commentId);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async getComment(req: Request<{ id: string }>, res: Response<CommentViewModel>, next: NextFunction) {
        try {
            const userId = req.userId as string
            const foundComment = await this.commentQueryRepository.getCommentByIdOrError(req.params.id, userId);
            res.status(200).json(foundComment)
        } catch (error) {
            next(error);
        }
    }

    async updateComment(req: Request<{ commentId: string }, {}, CommentInputModel>, res: Response<void>, next: NextFunction) {
        try {
            const userId = req.userId as string;
            await this.commentsService.checkCommentOwnership(req.params.commentId, userId);
            await this.commentsService.updateComment(req.params.commentId, req.body);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async updateLikeStatus(req: Request<{ commentId: string }, {}, {likeStatus: MyLikeStatusTypes }>, res: Response<void>, next: NextFunction) {
        try {
            const commentId = req.params.commentId;
            const likeStatus = req.body.likeStatus;
            const userId = req.userId as string;

            if(likeStatus === 'None') {
                res.sendStatus(204);
                return;
            }
            await this.commentsService.updateLikeStatus(commentId, userId, likeStatus);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}



