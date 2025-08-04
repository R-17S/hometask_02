import {Request, Response} from "express";
import {ConfirmRegistrationInputModel} from "../../../models/authType";
import {authService} from "../auth-service";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {Result} from "../../../helper/resultTypes";


export const confirmRegistrationHandler = async (req: Request<{}, {}, ConfirmRegistrationInputModel>, res: Response<Result<null>>) => {
    const {code} = req.body;
    const confirmUser = await authService.confirmRegistration(code)
    resultForHttpException(res, confirmUser);
};