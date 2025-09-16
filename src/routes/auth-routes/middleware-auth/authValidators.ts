import {body} from "express-validator";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";


export const authInputValidator = [
    body('loginOrEmail')
        .isString().withMessage('LoginOrEmail must be a string')
        .trim()
        .notEmpty().withMessage('Login or email is required'),
    body('password')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters')
];

export const registrationValidator = [
    body('login')
        .trim()
        .notEmpty().withMessage('Login is required')
        .isLength({ min: 3, max: 10 }).withMessage('Login must be 3-10 characters')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login contains invalid characters'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be 6-20 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email pattern mismatch')
];

export const emailValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/).withMessage('Email pattern mismatch')
];

export const newPasswordValidator = [
    body('newPassword')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    body('recoveryCode')
        .isString().withMessage('Recovery code must be a string')
        .notEmpty().withMessage('Recovery code is required'),
    inputErrorsResult
]

export const overallAuthValidation = [
    //authMiddleware,
    ...authInputValidator,
    inputErrorsResult
]

export const overallRegistrationValidator = [
    registrationValidator,
    inputErrorsResult
]

export const emailInputValidator =[
    ...emailValidator,
    inputErrorsResult
]