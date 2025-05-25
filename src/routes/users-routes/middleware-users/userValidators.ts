import {body} from "express-validator";
import {authMiddleware} from "../../../middlewares/autorization-middleware";
import {inputErrorsResult} from "../../../middlewares/errors-middleware";
import {NextFunction, Request, Response} from "express";
import {ErrorsTypeValidation} from "../../../models/errorsType";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/user-query-repository";


export const userInputValidator = [
    body ('login')
        .trim()
        .isLength({min: 3, max: 10}).withMessage('Login is required')
        .matches(/^[a-zA-Z0-9_-]*$/),
    body ('password')
        .isLength({min: 6, max: 20}).withMessage('Password is required'),
    body ('email')
        .isEmail().withMessage('Email is required'),
];

export const userExistsValidator = async  (req: Request<{id: string}>, res: Response<ErrorsTypeValidation | {}>, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({errorsMessage: [{field: 'id', message: 'Invalid user ID'}]});
        return;
    }
    const blog = await usersQueryRepository.getUserById(req.params.id);
    if (!blog) {
        res.status(404).json({errorsMessage: [{field: 'id', message: 'User not found'}]});
        return;
    }
    next();
};

export const overallUserValidation = [
    authMiddleware,
    ...userInputValidator,
    inputErrorsResult
]