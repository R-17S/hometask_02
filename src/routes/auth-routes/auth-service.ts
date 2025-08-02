
import {AuthInputModel} from "../../models/authType";
import {UserDbTypes} from "../../db/user-type";
import {usersRepository} from "../users-routes/repositories/user-repositories";
import {ObjectId, OptionalId, WithId, WithoutId} from "mongodb";
import {BadRequestException, NotFoundException, UnauthorizedException} from "../../helper/exceptions";
import {randomUUID} from "node:crypto";
import {bcryptService} from "./application/bcrypt-service";
import {emailExamples} from "../../helper/email-templates";
import {nodemailerService} from "./application/nodemailer-service";
import {add} from "date-fns";


export const authService = {
    async checkCredentials(input: AuthInputModel): Promise<WithId<UserDbTypes>> {
        const user = await usersRepository.findByLoginOrEmail(input.loginOrEmail);
        if (!user) throw new BadRequestException('Invalid login or email');

        const validPassword = await bcryptService.checkPassword(input.password, user.passwordHash);
        if (!validPassword) throw new UnauthorizedException('Invalid password');

        return user;
    },


    async registerUser(login: string, password: string, email: string): Promise<UserDbTypes> {
        const user = await usersRepository.getUserByLoginOrEmail(login, email);
        if (user) throw new BadRequestException(user.login === login
            ? 'Login already exists'
            : 'Email already exists');
        //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать

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
        await usersRepository.createUser(newUser); // сохранить юзера в базе данных

//отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
        try {
            await nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
                newUser.email,
                newUser.emailConfirmation!.confirmationCode,
                emailExamples.registrationEmail);
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return newUser;
    },

    async confirmRegistration(code: string): Promise<boolean> {
        // 1. Находим пользователя по code
        const user = await usersRepository.findByConfirmationCode(code);

        // 2. Проверяем нашелся ли он вообще, не стоит ли  у него статус true и активен ли ещё code
        if (!user) throw new NotFoundException('Invalid confirmation code');
        if (user.emailConfirmation!.isConfirmed) throw new BadRequestException('Email already confirmed');
        if (user.emailConfirmation!.expirationDate < new Date()) throw new BadRequestException('Confirmation code expired');

        // 3. Обновляем статус с false на true
        await usersRepository.updateConfirmationStatus(user._id.toString());

        return true;
    },

    async resendConfirmationEmail(email: string): Promise<boolean> {
        // 1. Находим пользователя по email
        const user = await usersRepository.findByEmail(email);

        // 2. Проверяем нашелся ли он вообще, не стоит ли  у него статус true
        if (!user) throw new NotFoundException('User with this email not found');
        if (user.emailConfirmation!.isConfirmed) throw new BadRequestException('Email already confirmed');

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
                emailExamples.resendConfirmationEmail
            );
        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return true;
    }
};
