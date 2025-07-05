import {commentsService} from "../comments-service";
import {NextFunction, Request, Response} from "express";


export const deleteCommentHandler = async (req: Request<{ commentId: string }>, res: Response, next:NextFunction) => {
    try {
        const userId = req.userId as string;
        await commentsService.checkCommentOwnership(req.params.commentId, userId);
        await commentsService.deleteComment(req.params.commentId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};