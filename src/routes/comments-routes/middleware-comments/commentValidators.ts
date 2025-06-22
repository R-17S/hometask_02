import {body} from "express-validator";
import {ErrorsTypeValidation} from "../../../models/errorsType";
import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {commentQueryRepository} from "../repositories/comment-query-repository";

export const commentInputValidation = [
    body('content')
        .isString().withMessage('Comment must be a string')
        .trim()
        .notEmpty().withMessage('Comment must be a string')
        .isLength({min: 20, max: 300}).withMessage('Comment must be no longer than 300 characters and shorter than 20'),
];

export const commentExistsValidation = async (req: Request<{id: string}>,res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid comment ID'}]});
        return;
    }

    const comment = await commentQueryRepository.getCommentById(req.params.id);
    if (!comment) {
        res.status(404).json({errorsMessage: [{field: 'id', message: 'Comment not found'}]});
        return;
    }
    next();
};

export const commentIdValidator = async (req: Request<{commentId: string}>, res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.commentId)) {
        res.status(400).json({errorsMessage: [{field: 'commentId', message: 'Invalid commentId ID'}]});
        return;
    }
    next();
};


export const overallCommentValidation = [
    ...commentInputValidation,
    inputErrorsResult
];