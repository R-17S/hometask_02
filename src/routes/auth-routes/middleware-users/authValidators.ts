import {body} from "express-validator";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";


export const authInputValidator = [
    body('loginOrEmail')
        .trim()
        .notEmpty().withMessage('Login or email is required'),
    body('password')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters')
];

export const overallAuthValidation = [
    //authMiddleware,
    ...authInputValidator,
    inputErrorsResult
]