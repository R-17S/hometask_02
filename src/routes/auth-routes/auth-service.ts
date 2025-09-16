
import {AuthInputModel} from "../../models/authType";
import {UserDbTypes} from "../../db/user-type";
import {usersRepository} from "../users-routes/repositories/user-repositories";
import {WithId} from "mongodb";
import {randomUUID} from "node:crypto";
import {bcryptService} from "./application/bcrypt-service";
import {emailTemplates} from "../../helper/email-templates";
import {nodemailerService} from "./application/nodemailer-service";
import {add} from "date-fns";
import {ResultObject} from "../../helper/resultClass";
import {Result} from "../../helper/resultTypes";
import {ResultStatus} from "../../helper/result-status.enum";
import {jwtService} from "./application/jwt-service";
import {sessionsRepository} from "./repositories/session-repositories";





export const authService = {
    async loginWithToken(input: AuthInputModel, context: { ip: string, userAgent: string }): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
        const credentialCheck = await this.checkCredentials(input);

        if (credentialCheck.status !== ResultStatus.Success) {
            return ResultObject.Unauthorized('User is not authorized', [
                { field: 'loginOrEmail or password', message: 'No such user' }
            ]); // отдаем ошибку наверх
        }

        const userId = credentialCheck.data!._id.toString();
        const deviceId = randomUUID();
        const ip = context.ip;
        const userAgent = context.userAgent;
        const [accessToken, refreshToken] = await Promise.all([
            jwtService.createAccessToken(userId, deviceId),
            jwtService.createRefreshToken(userId, deviceId)
        ]);
        const {iat, exp} = await jwtService.decodeToken(refreshToken)

        await sessionsRepository.createSession({
            userId,
            deviceId,
            ip,
            deviceTitle: userAgent,
            issuedAt: new Date(iat! * 1000),
            expiresAt: new Date(exp! * 1000),
            lastActiveDate: new Date(iat! * 1000),
        });

        return ResultObject.Success({ accessToken, refreshToken });
    },

    async checkCredentials(input: AuthInputModel): Promise<Result<WithId<UserDbTypes> | null>> {
        const user = await usersRepository.findByLoginOrEmail(input.loginOrEmail);
        if (!user) return ResultObject.NotFound('User not found', [
            { field: 'loginOrEmail', message: 'No such user' }
        ]);

        const validPassword = await bcryptService.checkPassword(input.password, user.passwordHash);
        if (!validPassword) return ResultObject.Unauthorized('User is not authorized', [
            { field: 'Password', message: 'Invalid password' }
        ]);

        return ResultObject.Success(user)
    },

    async registerUser(login: string, password: string, email: string): Promise<Result<WithId<UserDbTypes> | null>> {
        const user = await usersRepository.getUserByLoginOrEmail(login, email);
        if (user) return ResultObject.BadRequest(user.login === login
            ? 'Login already exists'
            : 'Email already exists', [
            { field: user.login === login ? 'login' : 'email', message: 'Already exists' }
        ]);//проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать

        const passwordHash = await bcryptService.generateHash(password)//создать хэш пароля

        const newUser: UserDbTypes = { // сформировать dto юзера
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed: false
            }
        };
        const createdUser = await usersRepository.createUser(newUser); // сохранить юзера в базе данных

        try {
            await nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
                newUser.email,
                newUser.emailConfirmation!.confirmationCode,
                emailTemplates.registrationEmail(newUser.emailConfirmation!.confirmationCode));
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return ResultObject.Success(null);
    },

    async confirmRegistration(code: string): Promise<Result<null>> {
        // 1. Находим пользователя по code
        const user = await usersRepository.findByConfirmationCode(code);

        // 2. Проверяем нашелся ли он вообще, не стоит ли  у него статус true и активен ли ещё code
        if (!user) return ResultObject.BadRequest('User not found', [{ field: 'code', message: 'Invalid confirmation code' }]);
        if (user.emailConfirmation!.isConfirmed) return ResultObject.BadRequest('Email already confirmed', [
                { field: 'code', message: 'Email already confirmed' }
        ]);
        if (user.emailConfirmation!.expirationDate < new Date()) return ResultObject.BadRequest('Confirmation code expired', [
                { field: 'code', message: 'Code expired' }
        ]);

        // 3. Обновляем статус с false на true
        await usersRepository.updateConfirmationStatus(user._id.toString());

        return ResultObject.Success(null);
    },

    async resendConfirmationEmail(email: string): Promise<Result<null>> {
        // 1. Находим пользователя по email
        const user = await usersRepository.findByEmail(email);

        // 2. Проверяем нашелся ли он вообще, не стоит ли  у него статус true
        if (!user) return ResultObject.BadRequest('User with this email not found', [
            { field: 'email', message: 'No user with this email' }
        ]);

        if (user.emailConfirmation!.isConfirmed) return ResultObject.BadRequest('Email already confirmed', [
            { field: 'email', message: 'User already confirmed' }
        ]);


        // 3. Генерируем новый код
        const newConfirmationCode = randomUUID();
        const newExpirationDate = add(new Date(), { hours: 24 });

        // 4. Обновляем данные
        await usersRepository.updateConfirmationCode(user._id.toString(), newConfirmationCode, newExpirationDate);

        // 5. Отправляем письмо
        try {
            await nodemailerService.sendEmail(
                email,
                newConfirmationCode,
                emailTemplates.resendConfirmationEmail(newConfirmationCode)
            );
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return ResultObject.Success(null);
    },

    async  refreshTokens(oldRefreshToken: string): Promise<Result<{ newAccessToken: string, newRefreshToken: string } | null>> {
        const payload = await jwtService.getPayloadFromToken(oldRefreshToken);
        if (!payload) return ResultObject.Unauthorized('User is not authorized', [
            { field: 'RefreshToken', message: 'Invalid Token' }
        ]);
        const { userId, deviceId } = payload;
        const [newAccessToken, newRefreshToken] = await Promise.all([
            jwtService.createAccessToken(userId, deviceId),
            jwtService.createRefreshToken(userId, deviceId)
        ])
        const refreshPayload = await jwtService.decodeToken(newRefreshToken)
        await sessionsRepository.updateSessionActivity(deviceId, new Date(refreshPayload.iat * 1000));

        return ResultObject.Success({ newAccessToken, newRefreshToken });
    },

    async revokeRefreshToken(refreshToken: string): Promise<Result<null>> {
        const payload  = await jwtService.getPayloadFromToken(refreshToken);
        if (!payload ) return ResultObject.Unauthorized('User is not authorized', [
            { field: 'RefreshToken', message: 'Invalid Token' }
        ]);

        const { userId, deviceId } = payload;
        const session = await sessionsRepository.findSession(userId, deviceId);
        if (!session) {
            return ResultObject.Success(null); // если сессия удалена или её не существует - думаю считать logout успешным
        }

        await sessionsRepository.deleteSession(userId, deviceId);
        return ResultObject.Success(null);
    },

    async sendRecoveryEmail(email: string): Promise<Result<null>> {
        const user = await usersRepository.findByEmail(email);
        if (!user) return ResultObject.Success(null);

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), { hours: 24 });
        const userId = user._id.toString();

        await usersRepository.saveRecoveryCode(userId, recoveryCode, expirationDate)
        try {
            await nodemailerService.sendEmail(
                email,
                recoveryCode,
                emailTemplates.recoveryPassword(recoveryCode)
            );
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return ResultObject.Success(null);
    },

    async confirmPasswordRecovery(newPassword: string, recoveryCode: string): Promise<Result<null>> {
        const user = await usersRepository.findByRecoveryCode(recoveryCode);

        if (!user) return ResultObject.BadRequest('Invalid or expired recovery code', [
            { field: 'recoveryCode', message: 'Code not found or already used' }
        ]);

        if (user.passwordRecovery!.expirationDate < new Date()) return ResultObject.BadRequest('Confirmation code expired', [
            { field: 'recoveryCode', message: 'Code not found or already used' }
        ]);

        const passwordHash = await bcryptService.generateHash(newPassword);
        await usersRepository.updatePassword(user._id, passwordHash)
        await usersRepository.clearRecoveryCode(user._id);
        return ResultObject.Success(null);
    }
};


