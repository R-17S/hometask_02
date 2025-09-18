import {nodemailerService} from "../../src/routes/auth-routes/application/nodemailer-service";
import {authService} from "../../src/routes/auth-routes/auth-service";
import {runDb, sessionsCollection, usersCollection} from "../../src/db/mongoDB";
import {MongoMemoryServer} from "mongodb-memory-server";
import {seedUserWithDevices, testFactoryUser} from "../datasets/integration-helpers";
import {jwtService} from "../../src/routes/auth-routes/application/jwt-service";
import {req} from "../datasets/test-client";
import {SETTINGS} from "../../src/settings";
import {UsersRepository} from "../../src/routes/users-routes/repositories/user-repositories";
import bcrypt from "bcrypt";


describe('AUTH-INTEGRATION', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await runDb(mongoServer.getUri());
    });

    beforeEach(async () => {
        await usersCollection.deleteMany({})
        await sessionsCollection.deleteMany({});
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

    describe('Refresh token', () => {
        it('should update refreshToken and lastActiveDate for device 1', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            const user = await testFactoryUser.insertUser({
                login,
                email,
                password,
                isConfirmed: true
            });
            await seedUserWithDevices(user.id, 4);

            const device = await sessionsCollection.findOne({deviceTitle: 'Device-1'});
            expect(device).toBeDefined();

            const oldLastActive = device!.lastActiveDate;
            const oldRefreshToken = await jwtService.createRefreshToken(device!.userId, device!.deviceId);
            const result = await authService.refreshTokens(oldRefreshToken);
            console.log('🔁 Result from refreshTokens:', result);

            expect(result.status).toBe('Success');
            expect(result.data).toHaveProperty('newAccessToken');
            expect(result.data).toHaveProperty('newRefreshToken');

            const updatedDevice = await sessionsCollection.findOne({deviceId: device!.deviceId});
            console.log('🔍 Updated device:', updatedDevice);
            expect(updatedDevice!.lastActiveDate).not.toEqual(oldLastActive);

            const allDevices = await sessionsCollection.find({userId: device!.userId}).toArray();
            expect(allDevices.length).toBe(4);
        });


        it('\'DELETE /security/devices/:deviceId\'', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            const user = await testFactoryUser.insertUser({
                login,
                email,
                password,
                isConfirmed: true
            });
            await seedUserWithDevices(user.id, 4);

            const device1 = await sessionsCollection.findOne({deviceTitle: 'Device-1'});
            const device2 = await sessionsCollection.findOne({deviceTitle: 'Device-2'});
            expect(device1).toBeDefined();
            expect(device2).toBeDefined();

            const refreshTokenDevice1 = await jwtService.createRefreshToken(device1!.userId, device1!.deviceId);

            await req
                .delete(`${SETTINGS.PATH.SECURITYDEVICES}/${device2!.deviceId}`)
                .set('Cookie', `refreshToken=${refreshTokenDevice1}`)
                .expect(204)

            const res = await req
                .get(SETTINGS.PATH.SECURITYDEVICES)
                .set('Cookie', `refreshToken=${refreshTokenDevice1}`)
                .expect(200)

            const deviceIds = res.body.map((d: any) => d.deviceId);
            expect(deviceIds).not.toContain(device2!.deviceId);
            expect(deviceIds).toContain(device1!.deviceId);
            expect(res.body.length).toBe(3);
        });

        it('should logout device 3 and verify it is removed from the list (queried by device 1)', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            const user = await testFactoryUser.insertUser({
                login,
                email,
                password,
                isConfirmed: true
            });
            await seedUserWithDevices(user.id, 4);

            const device1 = await sessionsCollection.findOne({deviceTitle: 'Device-1'});
            const device3 = await sessionsCollection.findOne({deviceTitle: 'Device-3'});
            expect(device1).toBeDefined();
            expect(device3).toBeDefined();

            const refreshTokenDevice1 = await jwtService.createRefreshToken(device1!.userId, device1!.deviceId);
            const refreshTokenDevice3 = await jwtService.createRefreshToken(device3!.userId, device3!.deviceId);

            await req
                .post(SETTINGS.PATH.AUTH + '/logout')
                .set('Cookie', `refreshToken=${refreshTokenDevice3}`)
                .expect(204)


            const res = await req
                .get(SETTINGS.PATH.SECURITYDEVICES)
                .set('Cookie', `refreshToken=${refreshTokenDevice1}`)
                .expect(200)

            expect(res.body.length).toBe(3);
            expect(res.body[0].deviceId).toBe(device1!.deviceId);
        });

        it('should delete all devices except the current one', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            const user = await testFactoryUser.insertUser({
                login,
                email,
                password,
                isConfirmed: true
            });
            await seedUserWithDevices(user.id, 4);

            const device1 = await sessionsCollection.findOne({deviceTitle: 'Device-1'});
            expect(device1).toBeDefined();

            const refreshTokenDevice1 = await jwtService.createRefreshToken(device1!.userId, device1!.deviceId);

            await req
                .delete(SETTINGS.PATH.SECURITYDEVICES)
                .set('Cookie', `refreshToken=${refreshTokenDevice1}`)
                .expect(204)


            const res = await req
                .get(SETTINGS.PATH.SECURITYDEVICES)
                .set('Cookie', `refreshToken=${refreshTokenDevice1}`)
                .expect(200)

                expect(res.body.length).toBe(1);
            expect(res.body[0].deviceId).toBe(device1!.deviceId);
        });
    });

    describe('POST /auth/password-recovery', () => {

        beforeEach( async () => {
            nodemailerService.sendEmail = jest.fn().mockResolvedValue(true);
        });

        it('should return 204 even if email is not registered', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            await authService.registerUser(login, password, email);

            // Восстановление для существующего email
            const validMail = await authService.sendRecoveryEmail(email)
            expect(validMail.status).toBe('Success');

            const userInDb = await UsersRepository.findByEmail(email);
            expect(userInDb?.passwordRecovery?.recoveryCode).toBeDefined();
            expect(userInDb?.passwordRecovery?.expirationDate).toBeInstanceOf(Date);
            expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(2);

            const ghostResult = await authService.sendRecoveryEmail('ghost@email.com');
            expect(ghostResult.status).toBe('Success');
            expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(2); // счётчик я приказываю не меняться
        });

        it('should update password and return 204', async () => {
            const {login, password, email} = testFactoryUser.createUserDto();
            await authService.registerUser(login, password, email);

            await authService.sendRecoveryEmail(email)

            const user = await UsersRepository.findByEmail(email);
            const recoveryCode = user!.passwordRecovery!.recoveryCode;

            const result = await authService.confirmPasswordRecovery('newPassword123', recoveryCode);
            expect(result.status).toBe('Success');

            const updateUser = await UsersRepository.findByEmail(email);
            const isMatch = await bcrypt.compare('newPassword123', updateUser!.passwordHash);
            expect(isMatch).toBe(true);
            expect(updateUser!.passwordRecovery).toBeUndefined();
        });
    });
})





