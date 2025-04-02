import {ErrorsType, FieldNamesType} from "../models/errorsType";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";


export const inputErrorsResult = (req: Request, res: Response<ErrorsType | {}>, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const eArray = errors.array({onlyFirstError: true}) as { path: FieldNamesType, msg: string }[];
        res.status(400).json({errorsMessages: eArray.map(e => ({field: e.path, message: e.msg}))});
        return;
    }
    next()
}