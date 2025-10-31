import {inputErrorsResult} from "./errors-middleware";
import {body} from "express-validator";

export const likeValidation = [
    body('likeStatus')
        .isString().withMessage('likeStatus must be a string')
        .isIn(['Like', 'Dislike', 'None']).withMessage('likeStatus must be Like, Dislike or None')
];

export const likeInputValidation = [
    ...likeValidation,
    inputErrorsResult
];