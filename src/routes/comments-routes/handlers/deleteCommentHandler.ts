import {commentsService} from "../comments-service";
import {Request, Response} from "express";


export const deleteCommentHandler = async (req: Request<{ commentId: string }>, res: Response) => {
    const commentId = req.params.commentId;
    const userId = req.userId // Предполагается, что пользователь добавлен в req при аутентификации
    if (userId !== undefined) {
        return res.status(400).send('Иди наухй')
    }
    // Проверка прав доступа (может ли пользователь удалить этот комментарий)
    const canDelete = await commentsService.checkCommentOwnership(commentId, userId);
    if (!canDelete) {
        return res.sendStatus(403); // Forbidden
    }

    // Удаление комментария
    const isDeleted = await commentsService.deleteComment(commentId);
    if (!isDeleted) {
        return res.sendStatus(404); // Not Found
    }

    res.sendStatus(204); // No Content (успешное удаление)
};