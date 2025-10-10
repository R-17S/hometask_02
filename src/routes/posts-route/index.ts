import {Router} from "express";
import {overallPostValidation, postExistsValidator, postIdValidator} from "./middleware-posts/postValidators";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {overallCommentValidation} from "../comments-routes/middleware-comments/commentValidators";
import {accessTokenGuard} from "../auth-routes/middleware-auth/accessTokenGuard";
import {PostsController} from "./handlers/posts-controller";
import {container} from "../../inversify.config";
import {optionalAccessAuthGuard} from "../auth-routes/middleware-auth/optionalAccessAuthGuard";


const postsController = container.get(PostsController);
export const postsRouter = Router();

// Роут для получения комментов поста
postsRouter.get('/:postId/comments', optionalAccessAuthGuard, postIdValidator, postsController.getCommentsByPostId.bind(postsController));
postsRouter.post('/:postId/comments', accessTokenGuard, postIdValidator, ...overallCommentValidation, postsController.createCommentByPostId.bind(postsController));

// Роуты  для главной posts
postsRouter.get('/', postsController.getPosts.bind(postsController));
postsRouter.get('/:id', postExistsValidator, postsController.getPost.bind(postsController));
postsRouter.post('/', ...overallPostValidation, postsController.createPost.bind(postsController));
postsRouter.put('/:id', postExistsValidator, ...overallPostValidation, postsController.updatePost.bind(postsController) );
postsRouter.delete('/:id', authBasicMiddleware, postExistsValidator, postsController.deletePost.bind(postsController));


