import {Router} from "express";
import {
    commentExistsValidation,
    commentIdValidator,
    likeInputValidation,
    overallCommentValidation
} from "./middleware-comments/commentValidators";
import {accessTokenGuard} from "../auth-routes/middleware-auth/accessTokenGuard";
import {container} from "../../inversify.config";
import {CommentsController} from "./handlers/comments-controller";



const commentsController = container.get(CommentsController);
export const commentsRoutes = Router();

//Роуты для комментариев
commentsRoutes.get('/:id', commentExistsValidation, commentsController.getComment.bind(commentsController));
commentsRoutes.put('/:commentId', accessTokenGuard,commentIdValidator, ...overallCommentValidation, commentsController.updateComment.bind(commentsController));
commentsRoutes.delete('/:commentId', accessTokenGuard, commentIdValidator, commentsController.deleteComment.bind(commentsController));

//Роуты для лайков
commentsRoutes.put('/:commentId/like-status', accessTokenGuard, likeInputValidation, commentsController.updateLikeStatus.bind(commentsController));