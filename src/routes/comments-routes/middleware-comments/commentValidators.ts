import {body} from "express-validator";
import {ErrorsTypeValidation} from "../../../models/errorsType";
import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comment-repository";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";

export const commentInputValidation = [
    body('comment')
        .isString().withMessage('Сomment must be a string')
        .trim()
        .notEmpty().withMessage('Сomment must be a string')
        .isLength({min: 20, max: 300}).withMessage('Сomment must be no longer than 30 characters'),
];

export const commentExistsValidation = async (req: Request<{id: string}>,res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid comment ID'}]});
        return;
    }

    const comment = await commentsRepository.getCommentById(req.params.id);
    if (!comment) {
        res.status(404).json({errorsMessage: [{field: 'id', message: 'Сomment not found'}]});
        return;
    }
    next();
};


export const overallCommentValidation = [
    ...commentInputValidation,
    inputErrorsResult
];