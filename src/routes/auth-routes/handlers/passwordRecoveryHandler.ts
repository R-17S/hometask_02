import {Request, Response} from "express";
import {authService} from "../auth-service";
import {resultForHttpException} from "../../../helper/resultForHttpException";


export const passwordRecoveryHandler = async (req: Request<{},{},{email: string}>, res: Response) => {
    const {email} = req.body;
    const result = await authService.sendRecoveryEmail(email);
    resultForHttpException(res, result);
};