import {NextFunction, Request, Response} from "express";
import {CommentInputModel, CommentViewModel} from "../../../models/commentTypes";
import {commentsService} from "../../comments-routes/comments-service";
import {commentQueryRepository} from "../../comments-routes/repositories/comment-query-repository";


export const createCommentByPostIdHandler = async (req: Request<{postId: string},{},CommentInputModel>, res: Response<CommentViewModel | {error: string}>, next: NextFunction) => {
    try {
        const newComment = await commentsService.createComment(req.body, req.params.postId, req.userId as string);
        const commentToView = await commentQueryRepository.getCommentByIdOrError(newComment.toString());
        res.status(201).json(commentToView);
    } catch (error) {
        next(error);
    }
};