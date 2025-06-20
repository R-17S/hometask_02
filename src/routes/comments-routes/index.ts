import {Router} from "express";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {getCommentHandler} from "./handlers/getCommentHandler";
import {updateCommentHandler} from "./handlers/updateCommentHandler";
import {commentExistsValidation, overallCommentValidation} from "./middleware-comments/commentValidators";
import {deleteCommentHandler} from "./handlers/deleteCommentHandler";


export const commentsRoutes = Router();

commentsRoutes.get('/:id', commentExistsValidation, getCommentHandler);
commentsRoutes.put('/:id',  ...overallCommentValidation, updateCommentHandler );
commentsRoutes.delete('/:id', authBasicMiddleware, deleteCommentHandler);