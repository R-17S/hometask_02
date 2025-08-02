import {db, setDB} from "./db";
import {BlogInputModel} from "../../src/models/blogTypes";
import {req} from "../datasets/test-client";
import {SETTINGS} from "../../src/settings";
import {authToken, createString, dataset1} from "../datasets/datasets";


describe('/blogs', () => {
    // beforeAll(async () => { // очистка базы данных перед началом тестирования
    //     setDB()
    // })

    it('should create newBlog', async () => {
        setDB()
        const newBlog: BlogInputModel = {
            name: 'Blog 3',
            description: 'Description 3',
            websiteUrl: 'https://blog3.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newBlog)
            .expect(201)

        console.log(res.body)

        expect(res.body.name).toEqual(newBlog.name)
        expect(res.body.description).toEqual(newBlog.description)
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl)
        expect(typeof res.body.id).toEqual('string')

        expect(res.body).toEqual(db.blogs[0])
    });

    it('shouldn\'t create 401 not authorized', async () => {
        setDB()
        const newBlog: BlogInputModel = {
            name: 'Blog 3',
            description: 'Description 3',
            websiteUrl: 'https://blog3.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(401)
        expect(res.text).toBe('Not authorized')


        console.log(res.text)

        expect(db.blogs.length).toEqual(0)
    });

    it('shouldn\'t create 400 bad validation', async () => {
        setDB()
        const newBlog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newBlog)
            .expect(400)

        console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')

        expect(db.blogs.length).toEqual(0)
    });

    it('should get empty array', async () => {
        setDB()

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toEqual(0)
    });

    it('should get not empty array', async () => {
        setDB(dataset1) // заполнение базы данных начальными данными

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toEqual(1)
        expect(res.body[0]).toEqual(dataset1.blogs[0])
    });

    it('shouldn\'t get find 404', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .expect(404)

        // console.log(res.body)
    });

    it('should get find 200', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .expect(200) // проверка на ошибку

        console.log(res.body)

        expect(res.body).toEqual(dataset1.blogs[0])
    });

    it ('should delete', async () => {
        setDB(dataset1)

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        // console.log(res.body)

        expect(db.blogs.length).toEqual(0)
    });

    it ('shouldn\'t delete', async () => {
        setDB()

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    });

    it('shouldn\'t del 401', async () => {
        setDB(dataset1)

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            //.set('Authorization', `Basic ${authToken}`)
            .expect(401) // проверка на ошибку

        // console.log(res.body)
    });

    it('should update', async () => {
        setDB(dataset1)
        const blog: BlogInputModel = {
            name: 'Blog 4',
            description: 'Description 4',
            websiteUrl: 'https://blog4.com',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(blog)
            .expect(204) // проверка на ошибку

        console.log(res.body)

        expect(db.blogs[0]).toEqual({...db.blogs[0], ...blog})
    });

    it('shouldn\'t update 404', async () => {
        setDB()
        const blog: BlogInputModel = {
            name: 'Blog 4',
            description: 'Description 4',
            websiteUrl: 'https://blog4.com',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .send(blog)
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    });

    it('shouldn\'t update2', async () => {
        setDB(dataset1)
        const blog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(blog)
            .expect(400) // проверка на ошибку

        console.log(res.body)

        expect(db).toEqual(dataset1)
        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')
    });


    it('shouldn\'t update 401', async () => {
        setDB(dataset1)
        const blog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}` + 'error')
            .send(blog)
            .expect(401) // проверка на ошибку

        console.log(res.text)

        expect(db).toEqual(dataset1)
    });
});