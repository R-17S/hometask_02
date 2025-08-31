import {nodemailerService} from "../../src/routes/auth-routes/application/nodemailer-service";
import {authService} from "../../src/routes/auth-routes/auth-service";
import {runDb, usersCollection} from "../../src/db/mongoDB";
import {MongoMemoryServer} from "mongodb-memory-server";
import {testFactoryUser} from "../datasets/integration-helpers";


describe('AUTH-INTEGRATION', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await runDb(mongoServer.getUri());
    });

    beforeEach(async () => {
        await usersCollection.deleteMany({})
    });

    afterAll(async () => {
        await mongoServer.stop();
    });

    describe('User Registration', () => {
        // Мокаем отправку письма
        beforeEach(() => {
            nodemailerService.sendEmail = jest.fn().mockResolvedValue(true);
        });

        it('should register user successfully', async () => {
            const {login, email, password} = testFactoryUser.createUserDto();
            const result = await authService.registerUser(login, password, email);

            // 🔍 Проверка на успешный статус
            expect(result.status).toBe('Success');
            // expect(result.data).toBeDefined();

            // ✅ Проверка содержимого
            // expect(result.data?.email).toBe(email);
            // expect(result.data?.passwordHash).not.toBe(password);

            // ✅ Проверка отправки email
            expect(nodemailerService.sendEmail).toBeCalled();
            expect(nodemailerService.sendEmail).toBeCalledTimes(1);

            // ✅ Проверка записи в базе
            const dbUser = await usersCollection.findOne({login});
            expect(dbUser).toBeDefined();
            expect(dbUser?.emailConfirmation?.isConfirmed).toBe(false);
        });

        it('should not register user twice', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            // ⏩ Первая регистрация проходит успешно
            const firstResult = await authService.registerUser(login, password, email);
            expect(firstResult.status).toBe('Success');

            // ⛔ Попытка зарегистрироваться второй раз
            const secondResult = await authService.registerUser(login, password, email);

            expect(secondResult.status).toBe('BadRequest');
            expect(secondResult.extensions).toEqual([
                {field: 'login', message: 'Already exists'}
            ]);

            const count = await usersCollection.countDocuments({$or: [{login}, {email}]});
            expect(count).toBe(1);
        });
    });

    describe('Confirm email', () => {
        const confirmEmailUseCase = authService.confirmRegistration;

        // ветка if для невалидного кода
        it('should reject invalid confirmation code', async () => {
            const result = await confirmEmailUseCase('invalid_code_123');

            expect(result.status).toBe('BadRequest');
            expect(result.extensions).toContainEqual({
                field: 'code',
                message: 'Invalid confirmation code'
            });
        });

        // ветка if для просроченного кода
        it('should throw BadRequest for expired code', async () => {
            const code = 'test';
            const {login, password, email} = testFactoryUser.createUserDto();

            // 1. Создаём пользователя с кодом, у которого expirationDate = текущая дата (уже истёк)
            await testFactoryUser.insertUser({
                login,
                password,
                email,
                code,
                expirationDate: new Date(), // Код уже недействителен!
            });

            const result = await confirmEmailUseCase(code);

            //  Ожидаем BadRequest
            expect(result.status).toBe('BadRequest');
            expect(result.extensions).toContainEqual({
                field: 'code',
                message: 'Code expired'
            });
        });

        // ветка if если у нас маил уже подтверждён
        it('should throw BadRequest if email already confirmed', async () => {
            const code = 'test'
            // Создаём пользователя с подтверждённым email
            const {login, password, email} = testFactoryUser.createUserDto();
            await testFactoryUser.insertUser({
                login,
                password,
                email,
                code,
                isConfirmed: true,
            });

            const result = await confirmEmailUseCase(code);

            expect(result.status).toBe('BadRequest');
            expect(result.extensions).toContainEqual({
                field: 'code',
                message: 'Email already confirmed'
            });
        });
    });
})





