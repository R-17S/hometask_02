import {body} from "express-validator";
import {blogsRepository} from "../../blogs-routes/blog-repositories";
import {NextFunction, Response, Request} from "express";
import {postsRepositories} from "../post-repositories";
import {authMiddleware} from "../../../middlewares/autorization-middleware";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {ObjectId} from "mongodb";
import {ErrorsType} from "../../../models/errorsType";


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
    .custom(async blogId => {
        const blog = await blogsRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error('Blog not found');
        }
        return true;
    }).withMessage('No blog found at existing blogId'),
];

export const postExistsValidation = async (req: Request<{id: string}>, res: Response<ErrorsType | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid post ID'}]});
        return;
    }
    const post = await postsRepositories.getPostById(req.params.id);
    if (!post) {
        res.status(404).json({errorsMessage:[ {field: 'id', message: 'Post not found'}]});
        return;
    }
    next();
};

export const overallPostValidation = [
    authMiddleware,
    ...postInputValidation,
    inputErrorsResult
];

// export const TextPostValidation = [
//     postExistsValidation,
//     inputErrorsResult
// ];

