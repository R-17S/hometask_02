import {Request, Response} from "express";
import {CommentInputModel, CommentViewModel} from "../../../models/commentTypes";
import {ErrorType} from "../../../models/errorsType";
import {commentsService} from "../comments-service";



export const updateCommentHandler = async (req: Request<{ commentId: string }, {}, CommentInputModel>, res: Response<CommentViewModel | ErrorType>) => {
    if (!req.userId) {
        res.sendStatus(401);
        return;
    }
    const userId = req.userId as string;
    const canEdit = await commentsService.checkCommentOwnership(req.params.commentId, userId);
    if (canEdit === false) {
        res.sendStatus(403); //  Проверка прав доступа (403)
        return
    }
    if (canEdit === null) {
        res.sendStatus(404); // Комментарий не найден
        return;
    }
    // Обновление комментария
    const isUpdated = await commentsService.updateComment(req.params.commentId, req.body);
    res.sendStatus(204);
};