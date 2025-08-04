import {Request, Response} from 'express';
import {authService} from "../auth-service";
import {AuthInputModel} from "../../../models/authType";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {Result} from "../../../helper/resultTypes";


export const authJwtHandler = async (req: Request<{},{},AuthInputModel>, res: Response<Result<{ accessToken: string } | null>>) => {
    const result = await authService.loginWithToken(req.body);
    resultForHttpException(res, result);
};