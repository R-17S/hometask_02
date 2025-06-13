import {commentsService} from "../comments-service";
import {Request, Response} from "express";


export const deleteCommentHandler = async (req: Request<{ commentId: string }>, res: Response) => {
    if (!req.userId) {
        res.sendStatus(401);
        return
    }
    const userId = req.userId as string;
    const canDelete = await commentsService.checkCommentOwnership(req.params.commentId, userId);
    if (canDelete === false) {
        res.sendStatus(403);
        return
    }
    if (canDelete === null) {
        res.sendStatus(404);
        return
    }

    const isDeleted = await commentsService.deleteComment(req.params.commentId);
    res.sendStatus(204);
};