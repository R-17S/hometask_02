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

    it('should return 204 on successful auth', async () => {
        await req
            .post('/auth/login')
            .send(correctUser)
            .expect(204);
    });


    it('should return 400 with error for invalid login', async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: 'nonexistent',
                password: correctUser.password
            })
            .expect(400);

        expect(res.body).toEqual({
            errorsMessage: [{
                field: "Login or Email",
                message: "Invalid login or email"
            }]
        });
    });

    it('should return 400 with error for invalid password', async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: correctUser.loginOrEmail,
                password: 'wrongpassword'
            })
            .expect(400);

        expect(res.body).toEqual({
            errorsMessage: [{
                field: "Password",
                message: "Invalid password"
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
});