import {Router} from "express";
import {getPostsHandler} from "./handlers/getPostsHandler";
import {overallPostValidation, postExistsValidation} from "./middleware-posts/postValidators";
import {getPostHandler} from "./handlers/getPostHandler";
import {createPostHandler} from "./handlers/createPostHandler";
import {updatePostHandler} from "./handlers/updatePostHandler";
import {authMiddleware} from "../../middlewares/autorization-middleware";
import {deletePostHandler} from "./handlers/deletePostHandler";


export const postsRouter = Router();

postsRouter.get('/', getPostsHandler);
postsRouter.get('/:id', postExistsValidation, getPostHandler);
postsRouter.post('/', ...overallPostValidation, createPostHandler);
postsRouter.put('/:id', postExistsValidation, ...overallPostValidation, updatePostHandler );
// postRouter.put('/:id', (req:  Request<{id: string},{},PostInputModel>, res: Response<PostViewModel>) => {
//     blogsRepository.getBlogById(req.body.blogId);
//     postsRepositories.getPostById(req.params.id);
//     postsRepositories.updatePost2(req.params.id, req.body)
//     const updatedPost = db.posts.find(post => post.id === req.params.id)!
//     res.status(200).json(postsRepositories.map2(updatedPost));
// });
postsRouter.delete('/:id', authMiddleware, postExistsValidation, deletePostHandler);


