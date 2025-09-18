import {body} from "express-validator";
import {NextFunction, Response, Request} from "express";
import {authBasicMiddleware} from "../../../middlewares/autorization-middleware";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {ObjectId} from "mongodb";
import {ErrorsTypeValidation} from "../../../models/errorsType";
import {BlogsService} from "../../blogs-routes/blog-service";
import {container} from "../../../inversify.config";
import {PostsRepository} from "../repositories/post-repositories";

const blogsService = container.get(BlogsService);
const postsRepository = container.get(PostsRepository);

export const basePostInputValidation = [
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
];

export const postInputValidation = [
    ...basePostInputValidation,
    body ('blogId')
        //const currentPost = new Date().getFullYear()
        //.isInt({min: 1, max: 1000}).withMessage('BlogId must be a number') Проверка на число
        //.optional({nullable: true}) Позволяет полю быть пустым
    .isString().withMessage('BlogId must be a string')
    .trim()
    .custom(async blogId => {
       await blogsService.checkBlogExists(blogId);
    }).withMessage('No blog found at existing blogId'),
];

export const postExistsValidator = async (req: Request<{id: string}>, res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid post ID'}]});
        return;
    }
    const post = await postsRepository.postExists(req.params.id);
    if (!post) {
        res.status(404).json({errorsMessage:[ {field: 'id', message: 'Post not found'}]});
        return;
    }
    next();
};

export const postIdValidator = async (req: Request<{postId: string}>, res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(400).json({errorsMessage: [{field: 'postId', message: 'Invalid postId ID'}]});
        return;
    }
    next();
};

export const overallPostValidation = [
    authBasicMiddleware,
    ...postInputValidation,
    inputErrorsResult
];

export const overallBasePostValidation = [
    authBasicMiddleware,
    ...basePostInputValidation,
    inputErrorsResult
];

// export const TextPostValidation = [
//     postExistsValidation,
//     inputErrorsResult
// ];

