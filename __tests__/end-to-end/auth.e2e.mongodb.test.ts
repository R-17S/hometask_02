import {req} from "../datasets/test-client";
import {runDb, usersCollection} from "../../src/db/mongoDB";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import {SETTINGS} from "../../src/settings";


describe('/auth', () => {
    const correctUser = {
        loginOrEmail: 'testuser',
        password: 'password123'
    };

    beforeAll(async () => {
        await runDb(SETTINGS.MONGO_URL)
        await usersCollection.deleteMany({});

        // Создаем тестового пользователя
        const passwordHash = await bcrypt.hash(correctUser.password, 10);
        await usersCollection.insertOne({
            _id: new ObjectId(),
            login: correctUser.loginOrEmail,
            email: 'testuser@example.com',
            passwordHash: passwordHash,
            createdAt: new Date()
        });
    });

    afterAll(async () => {
        await usersCollection.deleteMany({});
    });

    it('should return 200 on successful auth', async () => {
        await req
            .post('/auth/login')
            .send(correctUser)
            .expect(200);
    });


    it('should return 400 with error for invalid login', async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: '   ',
                password: correctUser.password
            })
            .expect(400);

        expect(res.body).toEqual({
            errorsMessages: [{
                field: "loginOrEmail",
                message: "Login or email is required"
            }]
        });
    });

    it('should return 401 with error for invalid password', async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: correctUser.loginOrEmail,
                password: 'wrongpassword'
            })
            .expect(401);

        expect(res.body).toEqual({
            errorsMessages: [{
                field: "loginOrEmail or password",
                message: "No such user"
            }]
        });
    });

    it('should validate input data', async () => {
        const testCases = [
            { data: { password: '123' }, expectedField: 'loginOrEmail' },
            { data: { loginOrEmail: 'test' }, expectedField: 'password' },
            { data: {}, expectedField: 'loginOrEmail' }
        ];

        for (const testCase of testCases) {
            const res = await req
                .post('/auth/login')
                .send(testCase.data)
                .expect(400);
            console.log(res.body)

            expect(res.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: testCase.expectedField
                    })
                ])
            );
            //expect(res.body.errorsMessages[0].field).toEqual('loginOrEmail')
            //expect(res.body.errorsMessages[1].field).toEqual('password')
            //expect(res.body.errorsMessages[2].field).toEqual('loginOrEmail')
        }
    });

    describe('Login with multiple 4 user-agents', () => {
        const correctUser = {
            loginOrEmail: 'testuser',
            password: 'password123'
        };

        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            'Mozilla/5.0 (Linux; Android 10)',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        ];

        let refreshTokens: string[] = [];

        it('should login 4 times with different user-agents and receive unique refreshTokens', async () => {
            for (const agent of userAgents) {
                const res = await req
                    .post('/auth/login')
                    .set('User-Agent', agent)
                    .send(correctUser)
                    .expect(200);

                const cookieHeader = res.headers['set-cookie'];
                console.log('Set-Cookie:', cookieHeader);
                const cookiesArray = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
                const refreshTokenCookie = cookiesArray.find((c: string) => c.startsWith('refreshToken='));
                const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
                refreshTokens.push(refreshToken);
                expect(res.body).toHaveProperty('accessToken');
                expect(cookieHeader).toBeDefined();
                expect(refreshTokenCookie).toBeDefined();
            }

            // Проверка уникальности refreshToken'ов
            const uniqueTokens = new Set(refreshTokens);
            expect(uniqueTokens.size).toBe(4);
        });
    });
});