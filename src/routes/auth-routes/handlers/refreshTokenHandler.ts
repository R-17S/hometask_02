import {Request, Response} from 'express';
import {authService} from "../auth-service";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {Result} from "../../../helper/resultTypes";
import {ResultStatus} from "../../../helper/result-status.enum";


export const refreshTokenHandler = async (req: Request, res: Response<Result<{ newAccessToken: string } | null>>) => {
    const oldRefreshToken = req.refreshToken!;

    const result = await authService.refreshTokens(oldRefreshToken);

    if (result.status !== ResultStatus.Success) {
        resultForHttpException(res, result);
    }

    const { newAccessToken, newRefreshToken } = result.data!;
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 20_000
    });

    resultForHttpException(res, {
        ...result,
        data:  { accessToken: newAccessToken }
    });
};