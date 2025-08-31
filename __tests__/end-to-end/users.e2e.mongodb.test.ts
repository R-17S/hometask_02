
import {authToken, createString,dataset3} from "../datasets/datasets";
import {SETTINGS} from "../../src/settings";
import {req} from "../datasets/test-client";
import {blogsCollection, postsCollection, runDb, usersCollection} from "../../src/db/mongoDB";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import {UserInputModel} from "../../src/models/userTypes";


describe('/users', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        await runDb(SETTINGS.MONGO_URL)
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
    })

    it('should create new user and return it', async () => {
        const newUser: UserInputModel = {
            login: 'newuser',
            password: 'password123',
            email: 'newuser@example.com'
        };

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newUser)
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            login: newUser.login,
            email: newUser.email,
            createdAt: expect.any(String)
        });

        const userInDb = await usersCollection.findOne({
            _id: ObjectId.createFromHexString(res.body.id) // метод для преобразования id в _id
        });

        expect(userInDb).not.toBeNull();
        expect(userInDb?.login).toBe(newUser.login);
        expect(userInDb?.email).toBe(newUser.email);
        expect(bcrypt.compareSync(newUser.password, userInDb!.passwordHash)).toBe(true); // Проверяем хеш пароля, а чё делать если  вдруг украли
    });


    it(`should/n't create 401 not authorized`, async () => {
        const newUser: UserInputModel = {
            login: 'newuser',
            password: 'password123',
            email: 'newuser@example.com'
        };


        const res = await req
            .post(SETTINGS.PATH.USERS)
            //.set('Authorization', `Basic ${authToken}`)
            .send(newUser)
            .expect(401)

        expect(res.text).toBe('Not authorized');

        console.log(res.text);
    });

    it (`shouldn\'t create 400 bad validation`, async () => {
        const newUser: UserInputModel = {
            login: createString(11),
            password: createString(21),
            email: createString(31),
        };

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newUser)
            .expect(400)

        console.log(res.body)
        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('login')
        expect(res.body.errorsMessages[1].field).toEqual('password')
        expect(res.body.errorsMessages[2].field).toEqual('email')

        // const blogInDb = await postsCollection.countDocuments({});
        // expect(blogInDb).toBe(3);
    });

    it('should not allow duplicate login and email together', async () => {
        const newUser = {
            login: 'testuser',
            password: 'password123',
            email: 'testuser@example.com'
        };

        await req
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newUser)
            .expect(201);

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newUser)
            .expect(400);

        expect(res.text).toMatch(/should be unique/); // Проверяем, что в тексте есть эта фраза
    });

    it ('should get empty array', async () => {
        await usersCollection.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic ${authToken}`)
            .expect(200)

        expect(res.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: expect.arrayContaining([])
        });
    });

    it('should get not empty array', async () => {
        await usersCollection.insertMany(dataset3.users)

        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic ${authToken}`)
            .expect(200)

        console.log(res.body)
        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 4,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(String)
                })
            ])
        });
        // Дополнительные проверки (если нужно)
        expect(res.body.items.length).toBe(4); // Проверяем длину массива items
        expect(res.body.totalCount).toBe(4);  // Проверяем общее количество
    });



    it ('should delete', async () => {
        await usersCollection.deleteMany({});
        await usersCollection.insertMany(dataset3.users)

        await req
            .delete(SETTINGS.PATH.USERS + '/' + dataset3.users[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        const postInDb = await usersCollection.countDocuments({});
        expect(postInDb).toBe(3);
    });

    it ('shouldn\'t delete', async () => {

        const res = await req
            .delete(SETTINGS.PATH.USERS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(400)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid user ID');
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .delete(`${SETTINGS.PATH.USERS}/${nonExistentId}`)
            .set('Authorization', `Basic ${authToken}`)
            .expect(404)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('User not found');
    });

    it ('shouldn\'t delete 401 not authorized', async () => {

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset3.users[0]._id)
            //.set('Authorization', `Basic ${authToken}`)
            .expect(401)

        expect(res.text).toBe('Not authorized');

        console.log(res.text);
    });
});