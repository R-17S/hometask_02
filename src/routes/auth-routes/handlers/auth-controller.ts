import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {Result} from "../../../helper/resultTypes";
import {AuthService} from "../auth-service";
import {ResultStatus} from "../../../helper/result-status.enum";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {ConfirmRegistrationInputModel, ResendConfirmationEmailInputModel} from "../../../models/authType";
import {UsersQueryRepository} from "../../users-routes/repositories/user-query-repository";
import {ResultObject} from "../../../helper/resultClass";
import {UserInputModel} from "../../../models/userTypes";


@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    ) {}

    async authLogin(req: Request, res: Response<Result<{ accessToken: string } | null>>) {
        req.context = {
            ip: typeof req.ip === 'string' ? req.ip : 'unknown',
            userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : 'unknown device'
        };
        const result = await this.authService.loginWithToken(req.body, req.context);

        if (result.status !== ResultStatus.Success) {
            resultForHttpException(res, result);
            return
        }

        const {accessToken, refreshToken} = result.data!;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 20_000
        });

        resultForHttpException(res, {
            ...result,
            data: {accessToken}
        });
    }

    async confirmRegistration(req: Request<{}, {}, ConfirmRegistrationInputModel>, res: Response<Result<null>>) {
        const {code} = req.body;
        const confirmUser = await this.authService.confirmRegistration(code)
        resultForHttpException(res, confirmUser);
    }

    async getCurrentUser(req: Request, res: Response) {
        const user = await this.usersQueryRepository.getUserById(req.userId as string);
        const result = user
            ? ResultObject.Success(user)
            : ResultObject.NotFound('User not found', [
                {field: 'userId', message: 'No user found with provided id'}
            ]);

        resultForHttpException(res, result);
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.refreshToken;
        const result = await this.authService.revokeRefreshToken(refreshToken!);

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
    }

    async newPassword(req: Request<{}, {}, { newPassword: string, recoveryCode: string }>, res: Response) {
        const {newPassword, recoveryCode} = req.body;
        const result = await this.authService.confirmPasswordRecovery(newPassword, recoveryCode);
        resultForHttpException(res, result);
    }

    async passwordRecovery(req: Request<{}, {}, { email: string }>, res: Response) {
        const {email} = req.body;
        const result = await this.authService.sendRecoveryEmail(email);
        if (result.status === ResultStatus.Success) {
            res.sendStatus(204);
            return
        }
        resultForHttpException(res, result);
    }

    async refreshToken(req: Request, res: Response<Result<{ accessToken: string } | null>>) {
        const oldRefreshToken = req.refreshToken!;
        const result = await this.authService.refreshTokens(oldRefreshToken);

        if (result.status !== ResultStatus.Success) {
            resultForHttpException(res, result);
        }

        const {newAccessToken, newRefreshToken} = result.data!;
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 20_000
        });

        resultForHttpException(res, {
            ...result,
            data: {accessToken: newAccessToken}
        });
    }

    async registration(req: Request<{}, {}, UserInputModel>, res: Response<Result<null>>) {
        const {login, password, email} = req.body;
        const newUser = await this.authService.registerUser(login, password, email);
        resultForHttpException(res, newUser);
    }

    async resendConfirmationEmail(req: Request<{}, {}, ResendConfirmationEmailInputModel>, res: Response<Result<null>>) {
        const {email} = req.body;
        const resendConfirmationUser = await this.authService.resendConfirmationEmail(email);
        resultForHttpException(res, resendConfirmationUser);
    }
}