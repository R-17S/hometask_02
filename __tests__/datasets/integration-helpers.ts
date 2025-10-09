import {randomUUID} from "crypto";
import {add} from "date-fns/add";

import {v4 as uuidv4} from 'uuid';
import {JwtService} from "../../src/routes/auth-routes/application/jwt-service";
import {UserModel} from "../../src/db/user-type";
import {SessionModel} from "../../src/db/session-type";



type RegisterUserPayloadType = {
    login: string,
    password: string,
    email: string,
    code?: string,
    expirationDate?: Date,
    isConfirmed?: boolean
}

export type RegisterUserResultType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
} // тоже что и UserDbTypes
const jwtService = new JwtService();

export const testFactoryUser = {
    createUserDto() {
        return {
            login: 'testing',
            email: 'test@gmail.com',
            password: '123456789'
        }
    },

    createUserDtos(count: number) {
        const users = [];

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                password: '12345678'
            })
        }
        return users;
    },

    async insertUser({login, password, email, code, expirationDate, isConfirmed}: RegisterUserPayloadType): Promise<RegisterUserResultType> {
        const newUser = {
            login,
            email,
            passwordHash: password,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {minutes: 30,}),
                isConfirmed: isConfirmed ?? false
            }
        };
        const result = await UserModel.insertOne(newUser);
        return {
            id: result._id.toString(),
            ...newUser
        }
    },
};

export async function seedUserWithDevices(userId: string, count: number) {
    const date = new Date();
    for (let i = 0; i < count; i++) {
        await SessionModel.insertOne({
            userId: userId,
            deviceId: uuidv4(),
            ip: '127.0.0.1',
            deviceTitle: `Device-${i+1}`,
            issuedAt: date,
            expiresAt: new Date(date.getTime() + 20_000),
            lastActiveDate: date,
        });
    }
}

export async function syncLastActiveDate(deviceId: string, token: string) {
    const { iat } = await jwtService.decodeToken(token);
    await SessionModel.updateOne(
        { deviceId },
        { $set: { lastActiveDate: new Date(iat * 1000) } }
    );
}