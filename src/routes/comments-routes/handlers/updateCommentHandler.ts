import {NextFunction, Request, Response} from "express";
import {CommentInputModel} from "../../../models/commentTypes";
import {commentsService} from "../comments-service";



export const updateCommentHandler = async (req: Request<{ commentId: string }, {}, CommentInputModel>, res: Response<void>, next:NextFunction) => {
    try {
        const userId = req.userId as string;
        await commentsService.checkCommentOwnership(req.params.commentId, userId);
        await commentsService.updateComment(req.params.commentId, req.body);
        res.sendStatus(204);
    }  catch (error) {
        next(error);
    }
};