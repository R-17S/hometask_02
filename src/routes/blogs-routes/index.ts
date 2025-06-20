import {Router} from "express";
import {blogExistsValidator, blogIdValidator, overallBlogValidation} from "./middlewares-blogs/blogValidators";
import {getBlogsHandler} from "./handlers/getBlogsHandler";
import {getBlogHandler} from "./handlers/getBlogHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {updateBlogHandler} from "./handlers/updateBlogHandler";
import {deleteBlogHandler} from "./handlers/deleteBlogHandler";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {getPostsByBlogIdHandler} from "./handlers/getPostsByBlogIdHandler";
import {overallBasePostValidation} from "../posts-route/middleware-posts/postValidators";
import {createPostByBlogIdHandler} from "./handlers/createPostByBlogIdHandler";



export const blogsRouter = Router();

// Роут для получения постов блога
blogsRouter.get('/:blogId/posts', blogIdValidator, getPostsByBlogIdHandler);
blogsRouter.post('/:blogId/posts', blogIdValidator, ...overallBasePostValidation, createPostByBlogIdHandler);

// Роуты  для главной blogs
blogsRouter.get('/', getBlogsHandler);
blogsRouter.get('/:id', blogExistsValidator, getBlogHandler);
blogsRouter.post('/', ...overallBlogValidation, createBlogHandler);
blogsRouter.put('/:id', blogExistsValidator, ...overallBlogValidation, updateBlogHandler);
blogsRouter.delete('/:id', authBasicMiddleware, blogExistsValidator, deleteBlogHandler);
