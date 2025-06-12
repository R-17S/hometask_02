import {body} from "express-validator";
import {ErrorsTypeValidation} from "../../../models/errorsType";
import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comment-repository";
import {authMiddleware} from "../../../middlewares/autorization-middleware";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {postInputValidation} from "../../posts-route/middleware-posts/postValidators";

export const commentInputValidation = [
    body('comment')
        .isString().withMessage('Title must be a string')
        .trim()
        .notEmpty().withMessage('Title must be a string')
        .isLength({min: 1, max: 30}).withMessage('Title must be no longer than 30 characters'),
];

export const commentExistsValidation = async (req: Request<{id: string}>,res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid comment ID'}]});
        return;
    }

    const comment = await commentsRepository.getCommentById(req.params.id);
    if (!comment) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid comment ID'}]});
        return;
    }
    next();
};


export const overallCommentValidation = [
    authMiddleware,
    ...commentInputValidation,
    inputErrorsResult
];