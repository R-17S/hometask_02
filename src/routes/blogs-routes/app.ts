import {Router} from "express";
import {blogExistsValidator, overallBlogValidation} from "./middlewares-blogs/blogValidators";
import {getBlogsHandler} from "./handlers/getBlogsHandler";
import {getBlogHandler} from "./handlers/getBlogHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {updateBlogHandler} from "./handlers/updateBlogHandler";
import {deleteBlogHandler} from "./handlers/deleteBlogHandler";
import {authMiddleware} from "../../middlewares/autorization-middleware";


export const blogsRouter = Router();

// Роуты  для главной blogs
blogsRouter.get('/', getBlogsHandler);
blogsRouter.get('/:id', blogExistsValidator, getBlogHandler);
blogsRouter.post('/', ...overallBlogValidation, createBlogHandler);
blogsRouter.put('/:id', blogExistsValidator, ...overallBlogValidation, updateBlogHandler);
blogsRouter.delete('/:id', authMiddleware, blogExistsValidator, deleteBlogHandler);
