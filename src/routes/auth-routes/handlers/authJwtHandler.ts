import {Request, Response} from 'express';
import {authService} from "../auth-service";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {Result} from "../../../helper/resultTypes";
import {ResultStatus} from "../../../helper/result-status.enum";


export const authJwtHandler = async (req: Request, res: Response<Result<{ accessToken: string } | null>>) => {
    const result = await authService.loginWithToken(req.body, req.context);

    if (result.status !== ResultStatus.Success) {
        resultForHttpException(res, result);
    }

    const { accessToken, refreshToken } = result.data!;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 20_000
    });

    resultForHttpException(res, {
        ...result,
        data:  { accessToken }
    });
};