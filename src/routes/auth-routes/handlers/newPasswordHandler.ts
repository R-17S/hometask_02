import {Request, Response} from "express";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {authService} from "../auth-service";


export const newPasswordHandler = async (req: Request<{},{},{newPassword: string, recoveryCode: string}>, res: Response) => {
    const { newPassword, recoveryCode } = req.body;
    const result = await authService.confirmPasswordRecovery(newPassword, recoveryCode);
    resultForHttpException(res, result);
};