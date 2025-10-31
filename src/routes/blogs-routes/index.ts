import {Router} from "express";
import {blogExistsValidator, blogIdValidator, overallBlogValidation} from "./middlewares-blogs/blogValidators";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {overallBasePostValidation} from "../posts-route/middleware-posts/postValidators";
import {container} from "../../inversify.config";
import {BlogsController} from "./handlers/blogs-controller";
import {optionalAccessAuthGuard} from "../auth-routes/middleware-auth/optionalAccessAuthGuard";


const blogsController = container.get(BlogsController);
export const blogsRouter = Router();

// Роут для получения постов блога
blogsRouter.get('/:blogId/posts', blogIdValidator,optionalAccessAuthGuard, blogsController.getPostsByBlogId.bind(blogsController));
blogsRouter.post('/:blogId/posts', blogIdValidator, ...overallBasePostValidation, blogsController.createPostByBlogId.bind(blogsController));

// Роуты  для главной blogs
blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));
blogsRouter.get('/:id', blogExistsValidator, blogsController.getBlogById.bind(blogsController));
blogsRouter.post('/', ...overallBlogValidation, blogsController.createBlog.bind(blogsController));
blogsRouter.put('/:id', blogExistsValidator, ...overallBlogValidation, blogsController.updateBlog.bind(blogsController));
blogsRouter.delete('/:id', authBasicMiddleware, blogExistsValidator, blogsController.deleteBlogById.bind(blogsController));
