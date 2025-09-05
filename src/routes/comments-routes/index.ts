import {Router} from "express";
import {getCommentHandler} from "./handlers/getCommentHandler";
import {updateCommentHandler} from "./handlers/updateCommentHandler";
import {commentExistsValidation, commentIdValidator, overallCommentValidation} from "./middleware-comments/commentValidators";
import {deleteCommentHandler} from "./handlers/deleteCommentHandler";
import {authJwtMiddleware} from "../auth-routes/middleware-auth/authJwtMiddleware";


export const commentsRoutes = Router();

commentsRoutes.get('/:id', commentExistsValidation, getCommentHandler);
commentsRoutes.put('/:commentId', authJwtMiddleware,commentIdValidator, ...overallCommentValidation, updateCommentHandler );
commentsRoutes.delete('/:commentId', authJwtMiddleware, commentIdValidator, deleteCommentHandler);