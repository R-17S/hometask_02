import {Request, Response} from "express";
import {CommentInputModel, CommentViewModel} from "../../../models/commentTypes";
import {ErrorType} from "../../../models/errorsType";
import {commentsService} from "../comments-service";



export const updateCommentHandler = async (req: Request<{ commentId: string }, {}, CommentInputModel>, res: Response<CommentViewModel | ErrorType | null | any>) => {
    const commentId = req.params.commentId;
    const userId = req.userId // Предполагается, что пользователь добавлен в req при аутентификации
    if (userId !== undefined) {
        return res.status(400).send('Иди наухй')
    }

    const canEdit = await commentsService.checkCommentOwnership(commentId, userId);
    if (!canEdit) {
        return res.sendStatus(403);
    }
    // Обновление комментария
    const isUpdated = await commentsService.updateComment(commentId, req.body);
    if (!isUpdated) {
        return res.sendStatus(404); // Not Found
    }

    res.sendStatus(204); // No Content (успешное обновление)
};