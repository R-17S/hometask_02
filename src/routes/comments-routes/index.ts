import {Router} from "express";
import {authMiddleware} from "../../middlewares/autorization-middleware";
import {getCommentHandler} from "./handlers/getCommentHandler";
import {updateCommentHandler} from "./handlers/updateCommentHandler";
import {deleteCommentHandler} from "./handlers/deleteCommentHandler";
import {commentExistsValidation, overallCommentValidation} from "./middleware-comments/commentValidators";


export const commentsRoutes = Router();

commentsRoutes.get('/:id', commentExistsValidation, getCommentHandler);
commentsRoutes.put('/:id',  ...overallCommentValidation, updateCommentHandler );
commentsRoutes.delete('/:id', authMiddleware, deleteCommentHandler);