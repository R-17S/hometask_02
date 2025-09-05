import {Router} from "express";
import {getPostsHandler} from "./handlers/getPostsHandler";
import {overallPostValidation, postExistsValidator, postIdValidator} from "./middleware-posts/postValidators";
import {getPostHandler} from "./handlers/getPostHandler";
import {createPostHandler} from "./handlers/createPostHandler";
import {updatePostHandler} from "./handlers/updatePostHandler";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {deletePostHandler} from "./handlers/deletePostHandler";
import {getCommentsByPostIdHandler} from "./handlers/getCommentsByPostIdHandler";
import {createCommentByPostIdHandler} from "./handlers/createCommentByPostIdHandler";
import {overallCommentValidation} from "../comments-routes/middleware-comments/commentValidators";
import {authJwtMiddleware} from "../auth-routes/middleware-auth/authJwtMiddleware";



export const postsRouter = Router();

// Роут для получения комментов поста
postsRouter.get('/:postId/comments', postIdValidator, getCommentsByPostIdHandler);
postsRouter.post('/:postId/comments', authJwtMiddleware, postIdValidator, ...overallCommentValidation, createCommentByPostIdHandler);

// Роуты  для главной posts
postsRouter.get('/', getPostsHandler);
postsRouter.get('/:id', postExistsValidator, getPostHandler);
postsRouter.post('/', ...overallPostValidation, createPostHandler);
postsRouter.put('/:id', postExistsValidator, ...overallPostValidation, updatePostHandler );
postsRouter.delete('/:id', authBasicMiddleware, postExistsValidator, deletePostHandler);


