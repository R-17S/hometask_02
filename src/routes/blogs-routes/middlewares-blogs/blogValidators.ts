import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsRepository} from "../blog-repositories";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {authMiddleware} from "../../../middlewares/autorization-middleware";

export const blogInputValidator = [
    body ('name')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({max: 15}).withMessage('Name must be no longer than 15 characters'),

    body ('description')
        .isString().withMessage('Description must be a string')
        .trim()
        .isLength({max: 500}).withMessage('Description must be no longer than 500 characters'),

    body ('websiteUrl')
        .isString().withMessage('WebsiteUrl must be a string')
        .trim()
        .isLength({max: 100}).withMessage('WebsiteUrl must be no longer than 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('WebsiteUrl must be a valid URL')
    ];

export const blogExistsValidator = (req: Request<{id: string}>, res: Response<BlogViewModel>, next: NextFunction) => {
    const blog = blogsRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    next();
};

export const overallBlogValidation = [
    authMiddleware,
    ...blogInputValidator,
    inputErrorsResult
]