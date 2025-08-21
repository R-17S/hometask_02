import {Request, Response} from 'express';
import {authService} from "../auth-service";
import {ResultStatus} from "../../../helper/result-status.enum";
import {resultForHttpException} from "../../../helper/resultForHttpException";



export const logoutHandler = async (req: Request, res: Response) => {
    const refreshToken = req.refreshToken; // уже есть из middleware
    const result = await authService.revokeRefreshToken(refreshToken!);

    if (result.status !== ResultStatus.Success) {
        resultForHttpException(res, result);
    }

    // Удаляем cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    resultForHttpException(res, result);
};