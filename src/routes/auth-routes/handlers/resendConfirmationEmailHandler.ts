import {Request, Response, NextFunction} from 'express';
import {ResendConfirmationEmailInputModel} from "../../../models/authType";
import {authService} from "../auth-service";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {Result} from "../../../helper/resultTypes";




export const resendConfirmationEmailHandler = async (req: Request<{}, {}, ResendConfirmationEmailInputModel>, res: Response<Result<null>>) => {
    const {email} = req.body;
    const resendConfirmationUser = await authService.resendConfirmationEmail(email);
    resultForHttpException(res, resendConfirmationUser);
};