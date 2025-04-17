
import {BlogInputModel} from "../src/models/blogTypes";
import {req} from "./datasets/test-client";
import {SETTINGS} from "../src/settings";
import {authToken, createString, dataset1} from "./datasets/datasets";
import {blogsCollection, runDb} from "../src/db/mongoDB";
import {ObjectId} from "mongodb";



describe('/blogs', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        await runDb(SETTINGS.MONGO_URL)
        await blogsCollection.deleteMany({})
    })

    it('should create new blog and return it', async () => {
        const blogs = await blogsCollection.insertMany([
            {
                _id: new ObjectId(),
                name: 'Blog 3',
                description: 'Description 3',
                websiteUrl: 'https://blog3.com',
                createdAt: new Date(),
                isMembership: false
            },
            {
                _id: new ObjectId(),
                name: 'Blog 4',
                description: 'Description 4',
                websiteUrl: 'https://blog4.com',
                createdAt: new Date(),
                isMembership: false
            }
        ]);
        console.log(blogs)

        expect(blogs).toMatchObject({
            acknowledged: true,
            insertedCount: 2,
            insertedIds: {
                '0': expect.any(ObjectId),
                '1': expect.any(ObjectId)
            }
        });

        const newBlog = {
            name: 'New Blog',
            description: 'New Description',
            websiteUrl: 'https://newblog.com'
        };

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newBlog)
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(ObjectId),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        });

        const blogInDb = await blogsCollection.findOne({ _id: ObjectId.createFromHexString(res.body.id) });
        expect(blogInDb).not.toBeNull();
    });

    it('shouldn\'t create 401 not authorized', async () => {

        const newBlog: BlogInputModel = {
            name: 'Blog 3',
            description: 'Description 3',
            websiteUrl: 'https://blog3.com',
        };

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(401);

        expect(res.text).toBe('Not authorized')

        console.log(res.text)

        const blogInDb = await blogsCollection.countDocuments({})
        expect(blogInDb).toBe(3);
    });

    it('shouldn\'t create 400 bad validation', async () => {

        const incorrectBlog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${authToken}`)
            .send(incorrectBlog)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(3);
        expect(res.body.errorsMessages[0].field).toEqual('name');
        expect(res.body.errorsMessages[1].field).toEqual('description');
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');

        const blogInDb = await blogsCollection.countDocuments({});
        expect(blogInDb).toBe(3);
    });

    it('should get empty array', async () => {
        await blogsCollection.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200);

        expect(res.body).toEqual([]);
    });

    it('should get not empty array', async () => {
        await blogsCollection.insertMany(dataset1.blogs)

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200);

        console.log(res.body);

        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(dataset1.blogs[0]);
    });

    it ('shouldn\'t get find 400', async () => {

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(400) // проверка на ошибку

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages[0].field).toEqual('id');
        expect(res.body.errorsMessages[0].message).toEqual('Invalid blog ID');
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${nonExistentId}`)
            .expect(404)

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages[0].field).toEqual('id');
        expect(res.body.errorsMessages[0].message).toEqual('Blog not found');
    });

    it('should get find 200', async () => {

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .expect(200)

        console.log(res.body)

        expect(res.body).toEqual(dataset1.blogs[0])
    });

    it ('should delete', async () => {
        await blogsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset1.blogs)

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        const blogInDb = await blogsCollection.countDocuments({});
        expect(blogInDb).toBe(0);
    });

    it ('shouldn\'t delete', async () => {

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(400) // проверка на ошибку

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages[0].field).toEqual('id');
        expect(res.body.errorsMessages[0].message).toEqual('Invalid blog ID');
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${nonExistentId}`)
            .expect(404)

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages[0].field).toEqual('id');
        expect(res.body.errorsMessages[0].message).toEqual('Blog not found');
    });

    it('shouldn\'t del 401', async () => {

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            //.set('Authorization', `Basic ${authToken}`)
            .expect(401) // проверка на ошибку

        expect(res.text).toBe('Not authorized');

        console.log(res.text);
    });

    it('should update', async () => {
        await blogsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset1.blogs);

        const blog: BlogInputModel = {
            name: 'Blog update',
            description: 'Description update',
            websiteUrl: 'https://blogUpdate.com',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(blog)
            .expect(204) // проверка на ошибку

        const updateBlog = await blogsCollection.findOne({_id: dataset1.blogs[0]._id});

        expect(updateBlog).toMatchObject({
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: dataset1.blogs[0].createdAt,
            isMembership: dataset1.blogs[0].isMembership
        });

        //expect(dataset1.blogs[0]).toEqual({...dataset1.blogs[0], ...blog})
    });

    it('shouldn\'t update 400', async () => {
        await blogsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset1.blogs);

        const blog: BlogInputModel = {
            name: 'Blog update',
            description: 'Description update',
            websiteUrl: 'https://blogUpdate.com',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .send(blog)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages[0].field).toEqual('id');
        expect(res.body.errorsMessages[0].message).toEqual('Invalid blog ID');
    });

    it('shouldn\'t update 404', async () => {
        await blogsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset1.blogs);

        const blog: BlogInputModel = {
            name: 'Blog update',
            description: 'Description update',
            websiteUrl: 'https://blogUpdate.com',
        }


        const nonExistentId = new ObjectId();
        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${nonExistentId}`)
            .set('Authorization', `Basic ${authToken}`)
            .send(blog)
            .expect(404)

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages[0].field).toEqual('id');
        expect(res.body.errorsMessages[0].message).toEqual('Blog not found');
    });

    it('shouldn\'t update2', async () => {

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

        //console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')
    });


    it('shouldn\'t update 401', async () => {

        const blog: BlogInputModel = {
            name: 'Blog update',
            description: 'Description update',
            websiteUrl: 'https://blogUpdate.com',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}` + 'error')
            .send(blog)
            .expect(401) // проверка на ошибку

        console.log(res.text)

        expect(res.text).toEqual('Not authorized')
    });
});