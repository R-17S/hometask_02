import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {usersCollection} from "../../src/db/mongoDB";



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


export const testFactoryUser= {
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
    async insertUser(
        {
            login,
            password,
            email,
            code,
            expirationDate,
            isConfirmed
        }: RegisterUserPayloadType
    ): Promise<RegisterUserResultType> {
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
        const result = await usersCollection.insertOne(newUser);
        return {
            id: result.insertedId.toString(),
            ...newUser
        }
    }
}