import {nodemailerService} from "../../src/routes/auth-routes/application/nodemailer-service";
import {authService} from "../../src/routes/auth-routes/auth-service";
import {runDb, usersCollection} from "../../src/db/mongoDB";
import {MongoMemoryServer} from "mongodb-memory-server";
import {testFactoryUser} from "../datasets/integration-helpers";
import {BadRequestException} from "../../src/helper/exceptions";
import {ObjectId} from "mongodb";

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
            const { login, email, password } = testFactoryUser.createUserDto();
            const result = await authService.registerUser(login, password, email);

            // 🔍 Проверка result
            expect(result).toBeDefined();
            expect(result.email).toBe(email);
            expect(result.passwordHash).not.toBe(password);

            // ✅ Проверка отправки email
            expect(nodemailerService.sendEmail).toBeCalled();
            expect(nodemailerService.sendEmail).toBeCalledTimes(1);

            // ✅ Проверка записи в базе
            const dbUser = await usersCollection.findOne({ login });
            expect(dbUser).toBeDefined();
            expect(dbUser?.emailConfirmation?.isConfirmed).toBe(false);
        });

        it('should not register user twice', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            await  authService.registerUser(login, password, email);


            await expect( authService.registerUser(login, password, email))
                .rejects
                .toThrow('Login already exists');

            const count = await usersCollection.countDocuments({$or: [{login}, {email}]});
            expect(count).toBe(1);
        });
    });

    describe('Confirm email', () => {
        const confirmEmailUseCase = authService.confirmRegistration;

        // ветка if для невалидного кода
        it('should reject invalid confirmation code', async () => {
            await expect(confirmEmailUseCase('invalid_code_123'))
                .rejects
                .toThrow("Invalid confirmation code");
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

            // 2. Пытаемся подтвердить email с просроченным кодом
            await expect(confirmEmailUseCase(code))
                .rejects
                .toThrow('Confirmation code expired');
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

            await expect(confirmEmailUseCase(code))
                .rejects
                .toThrow('Email already confirmed');
        });


        //
        //     describe('User Registration', () => {
        //     jest.mock('../../src/routes/users-routes/repositories/user-repositories', () => ({
        //         getUserByLoginOrEmail: jest.fn().mockImplementation(async (loginOrEmail: string) => {
        //             return await usersCollection.findOne({
        //                 $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        //             });
        //         }),
        //         createUser: jest.fn().mockImplementation(async (user: any) => {
        //             const result = await usersCollection.insertOne(user);
        //             return { ...user, _id: result.insertedId };
        //         })
        //     }));
        // });
        //
        //     it('should register user with correct data', async () => {
        //         const {login, pass, email} = testFactoryUser.createUserDto();
        //
        //         const result = await authService.registerUser(login, pass, email);
        //
        //         const userInDb = await usersCollection.findOne({email});
        //         expect(userInDb).toBeDefined();
        //
        //         expect(nodemailerService.sendEmail).toBeCalled();
        //         expect(nodemailerService.sendEmail).toBeCalledTimes(1);
        //     });
        //
        //     it('should not register user twice', async () => {
        //         const {login, pass, email} = testFactoryUser.createUserDto();
        //         await  authService.registerUser(login, pass, email);
        //
        //         await expect( authService.registerUser(login, pass, email))
        //             .rejects
        //             .toThrow(BadRequestException);
        //
        //         const count = await usersCollection.countDocuments({$or: [{login}, {email}]});
        //         expect(count).toBe(1);
        //     });
        // // })

        // ветка если всё нормально
        // it('should confirm email with valid code', async () => {
        //     // 1. Подготовка: создаём пользователя с неподтверждённым email
        //     const code = '123e4567-e89b-12d3-a456-426614174000';
        //     const {login, password, email} = testFactoryUser.createUserDto();
        //
        //     // 1. Создаём пользователя с НЕподтверждённым email (isConfirmed: false по умолчанию)
        //     const insertedUser = await testFactoryUser.insertUser({
        //         login,
        //         password,
        //         email,
        //         code
        //     });
        //
        //     // 2. Подтверждаем email
        //     const result = await confirmEmailUseCase(code);
        //
        //     // 3. Проверки
        //     expect(result).toBe(true); // Проверяем возвращаемое значение
        //
        //     // 4. Проверяем обновление в БД
        //     const {users} = getCollections();
        //     const updatedUser = await users.findOne({
        //         _id: new ObjectId(insertedUser.id) // Используем ID из результата insertUser
        //     });
        //
        //     // Проверяем что:
        //     // - статус подтверждения стал true
        //     // - другие данные не изменились
        //     expect(updatedUser).toMatchObject({
        //         login,
        //         email,
        //         'emailConfirmation.isConfirmed': true,
        //         'emailConfirmation.confirmationCode': code
        //     });
    //     });
    });
});





