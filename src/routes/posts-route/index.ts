import {Router} from "express";
import {getPostsHandler} from "./handlers/getPostsHandler";
import {overallPostValidation, postExistsValidator, postIdValidator} from "./middleware-posts/postValidators";
import {getPostHandler} from "./handlers/getPostHandler";
import {createPostHandler} from "./handlers/createPostHandler";
import {updatePostHandler} from "./handlers/updatePostHandler";
import {authMiddleware} from "../../middlewares/autorization-middleware";
import {deletePostHandler} from "./handlers/deletePostHandler";
import {getCommentsByPostIdHandler} from "./handlers/getCommentsByPostIdHandler";
import {createCommentByPostIdHandler} from "./handlers/createCommentByPostIdHandler";



export const postsRouter = Router();

// Роут для получения комментов поста
postsRouter.get('/:postId/comments', postIdValidator, getCommentsByPostIdHandler);
postsRouter.post('/:postId/comments', postIdValidator, createCommentByPostIdHandler);

// Роуты  для главной posts
postsRouter.get('/', getPostsHandler);
postsRouter.get('/:id', postExistsValidator, getPostHandler);
postsRouter.post('/', ...overallPostValidation, createPostHandler);
postsRouter.put('/:id', postExistsValidator, ...overallPostValidation, updatePostHandler );
// postsRouter.put('/:id', (req:  Request<{id: string},{},PostInputModel>, res: Response<PostViewModel>) => {
    // const foundBlog = blogsRepository.getBlogById(req.body.blogId);
    // if(!foundBlog) return res.sendStatus(404)
    // const foundPost = postsRepositories.getPostById(req.params.id);
    // if(!foundBlog) return res.sendStatus(404)
    // postsRepositories.updatePost2(req.params.id, req.body)
    // res.sendStatus(200)
// });
postsRouter.delete('/:id', authMiddleware, postExistsValidator, deletePostHandler);


