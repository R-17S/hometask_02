import {Router} from "express";
import {getCommentHandler} from "./handlers/getCommentHandler";
import {updateCommentHandler} from "./handlers/updateCommentHandler";
import {commentExistsValidation, commentIdValidator, overallCommentValidation} from "./middleware-comments/commentValidators";
import {deleteCommentHandler} from "./handlers/deleteCommentHandler";
import {accessTokenGuard} from "../auth-routes/middleware-auth/accessTokenGuard";


export const commentsRoutes = Router();

commentsRoutes.get('/:id', commentExistsValidation, getCommentHandler);
commentsRoutes.put('/:commentId', accessTokenGuard,commentIdValidator, ...overallCommentValidation, updateCommentHandler );
commentsRoutes.delete('/:commentId', accessTokenGuard, commentIdValidator, deleteCommentHandler);