import {body} from "express-validator";
import {blogsRepository} from "../../blogs-routes/blog-repositories";
import {NextFunction, Response, Request} from "express";
import {PostViewModel} from "../../../models/postTypes";
import {postsRepositories} from "../post-repositories";
import {authMiddleware} from "../../../middlewares/autorization-middleware";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";


export const postInputValidation = [
    body ('title')
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title must be a string')
    .isLength({min: 1, max: 30}).withMessage('Title must be no longer than 30 characters'),

    body ('shortDescription')
    .isString().withMessage('ShortDescription must be a string')
    .trim()
    .notEmpty().withMessage('Title must be a string')
    .isLength({min: 1, max: 100}).withMessage('ShortDescription must be no longer than 100 characters'),

    body ('content')
    .isString().withMessage('Content must be a string')
    .trim()
    .notEmpty().withMessage('Title must be a string')
    .isLength({min: 1, max: 1000}).withMessage('Content must be no longer than 1000 characters'),

    body ('blogId')
        //const currentPost = new Date().getFullYear()
        //.isInt({min: 1, max: 1000}).withMessage('BlogId must be a number') Проверка на число
        //.optional({nullable: true}) Позволяет полю быть пустым
    .isString().withMessage('BlogId must be a string')
    .trim()
    .custom(blogId => {
        const blog = blogsRepository.getBlogById(blogId);
        return !!blog
    }).withMessage('No blog found at existing blogId')
];

export const postExistsValidation = (req: Request<{id: string}>, res: Response<PostViewModel>, next: NextFunction) => {
    const post = postsRepositories.getPostById(req.params.id);
    if (!post) {
        res.sendStatus(404)
        return;
    }
    next();
};

export const overallPostValidation = [
    authMiddleware,
    ...postInputValidation,
    inputErrorsResult
];
