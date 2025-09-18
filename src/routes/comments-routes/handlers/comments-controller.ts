import {inject, injectable} from "inversify/lib/esm";
import {CommentsService} from "../comments-service";
import {CommentQueryRepository} from "../repositories/comment-query-repository";
import {NextFunction, Request, Response} from "express";
import {CommentInputModel, CommentViewModel} from "../../../models/commentTypes";


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
            const foundComment = await this.commentQueryRepository.getCommentByIdOrError(req.params.id);
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
}



