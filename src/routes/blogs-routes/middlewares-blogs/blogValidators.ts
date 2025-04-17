import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {blogsRepository} from "../blog-repositories";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {authMiddleware} from "../../../middlewares/autorization-middleware";
import {ObjectId} from "mongodb";
import {ErrorsType} from "../../../models/errorsType";

export const blogInputValidator = [
    body ('name')
        .isString().withMessage('Name must be a string')
        .trim()
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({max: 15}).withMessage('Name must be no longer than 15 characters'),

    body ('description')
        .isString().withMessage('Description must be a string')
        .trim()
        .notEmpty().withMessage('Description cannot be empty')
        .isLength({max: 500}).withMessage('Description must be no longer than 500 characters'),

    body ('websiteUrl')
        .isString().withMessage('WebsiteUrl must be a string')
        .trim()
        .notEmpty().withMessage('WebsiteUrl cannot be empty')
        .isLength({max: 100}).withMessage('WebsiteUrl must be no longer than 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('WebsiteUrl must be a valid URL')
    ];

export const blogExistsValidator = async  (req: Request<{id: string}>, res: Response<ErrorsType | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(400).json({errorsMessage: {field: 'id', message: 'Invalid blog ID'}});
        return;
    }
    const blog = await blogsRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404).json({errorsMessage: {field: 'id', message: 'Blog not found'}});
        return;
    }
    next();
};

export const overallBlogValidation = [
    authMiddleware,
    ...blogInputValidator,
    inputErrorsResult
]