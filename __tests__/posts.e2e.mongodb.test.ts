
import {authToken, createString, dataset2} from "./datasets/datasets";
import {PostInputModel} from "../src/models/postTypes";
import {SETTINGS} from "../src/settings";
import {req} from "./datasets/test-client";
import {blogsCollection, postsCollection, runDb} from "../src/db/mongoDB";
import {ObjectId} from "mongodb";


describe('/posts', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        await runDb(SETTINGS.MONGO_URL)
        await postsCollection.deleteMany({})
    })

    it('should create newPost', async () => {

        const testBlog = await blogsCollection.insertOne({
            _id: new ObjectId(),
            name: 'Test Blog',
            description: 'Test',
            websiteUrl: 'https://test.com',
            createdAt: new Date(),
            isMembership: false
        });
        console.log(testBlog)

        expect(testBlog).toMatchObject({
            acknowledged: true,
            insertedId: expect.any(ObjectId)
        });

        const newPost = {
            title: 'Create Post',
            shortDescription: 'Create Short',
            content: 'Create Content',
            blogId: testBlog.insertedId.toString(), // Используем ID созданного блога
        };

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newPost)
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            ...newPost,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        });

        // // 6. Проверка в БД
        // const postInDb = await postsCollection.findOne({
        //     _id: new ObjectId(res.body.id)
        // });
        // expect(postInDb).toMatchObject({
        //     title: newPost.title,
        //     blogId: new ObjectId(newPost.blogId)
        // });
    });


    it(`should/n't create 401 not authorized`, async () => {

        const newPost: PostInputModel = {
            title: 'Post 1',
            shortDescription: 'Short 1',
            content: 'Content 1',
            blogId: new ObjectId().toString(),
        };

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            //.set('Authorization', `Basic ${authToken}`)
            .send(newPost)
            .expect(401)

        expect(res.text).toBe('Not authorized');

        console.log(res.text);
    });

    it (`shouldn\'t create 400 bad validation`, async () => {

        const newPost: PostInputModel = {
            title: createString(31),
            shortDescription: createString(101),
            content: createString(1001),
            blogId: new ObjectId().toString(),
        };

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newPost)
            .expect(400)

        console.log(res.body)
        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

        // const blogInDb = await postsCollection.countDocuments({});
        // expect(blogInDb).toBe(3);
    });

    it ('should get empty array', async () => {
        await postsCollection.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        expect(res.body.length).toEqual(0)
    });

    it('should get not empty array', async () => {
        await postsCollection.insertMany(dataset2.posts)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        console.log(res.body)
        const expectedPost = {
            id: dataset2.posts[0]._id.toString(),
            title: dataset2.posts[0].title,
            shortDescription: dataset2.posts[0].shortDescription,
            content: dataset2.posts[0].content,
            blogId: dataset2.posts[0].blogId,
            blogName: dataset2.posts[0].blogName,
            createdAt: dataset2.posts[0].createdAt.toISOString(),
        }
        expect(res.body).toHaveLength(1)
        expect(res.body[0]).toEqual(expectedPost);
    });

    it ('shouldn\'t get find 400', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(400)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid post ID');
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${nonExistentId}`)
            .expect(404)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Post not found');
    });

    it('should get find 200', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .expect(200)

        console.log(res.body)
        const expectedPost = {
            id: dataset2.posts[0]._id.toString(),
            title: dataset2.posts[0].title,
            shortDescription: dataset2.posts[0].shortDescription,
            content: dataset2.posts[0].content,
            blogId: dataset2.posts[0].blogId,
            blogName: dataset2.posts[0].blogName,
            createdAt: dataset2.posts[0].createdAt.toISOString(),
        };

        expect(res.body).toEqual(expectedPost);
    });

    it ('should delete', async () => {
        await postsCollection.deleteMany({});
        await postsCollection.insertMany(dataset2.posts)

        await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        const postInDb = await postsCollection.countDocuments({});
        expect(postInDb).toBe(0);
    });

    it ('shouldn\'t delete', async () => {

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(400)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid post ID');
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${nonExistentId}`)
            .set('Authorization', `Basic ${authToken}`)
            .expect(404)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Post not found');
    });

    it ('shouldn\'t delete 401 not authorized', async () => {

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            //.set('Authorization', `Basic ${authToken}`)
            .expect(401)

        expect(res.text).toBe('Not authorized');

        console.log(res.text);
    });


    it('should update', async () => {
        await postsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset2.blogs);
        await postsCollection.insertMany(dataset2.posts);

        // const blogExists = await blogsCollection.findOne({
        //     _id: dataset2.blogs[1]._id
        // });
        // expect(blogExists).not.toBeNull();

        const post: PostInputModel = {
            title: 'Post 15',
            shortDescription: 'Short 15',
            content: 'Content 15',
            blogId: dataset2.blogs[1]._id.toString(),
        };

        await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(204)

        const updateBlog = await postsCollection.findOne({_id: dataset2.posts[0]._id});

        expect(updateBlog).toEqual({
            _id: dataset2.posts[0]._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: dataset2.posts[0].blogName,
            createdAt: dataset2.posts[0].createdAt,
        });

        //expect(db.posts[0]).toEqual({...db.posts[0], ...post, blogName: dataset2.blogs[0].name});
    });

    it('shouldn\'t update 400', async () => {

        const post: PostInputModel = {
            title: 'Post 16',
            shortDescription: 'Short 16',
            content: 'Content 16',
            blogId: dataset2.blogs[1]._id.toString(),
        };

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(400)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid post ID');
    });

    it('shouldn\'t update 404', async () => {

        const post: PostInputModel = {
            title: 'Post 16',
            shortDescription: 'Short 16',
            content: 'Content 16',
            blogId: dataset2.blogs[1]._id.toString(),
        };

        const nonExistentId = new ObjectId();
        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${nonExistentId}`)
            .set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(404)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Post not found');
    });

    it (`shouldn\'t update 400 bad validation`, async () => {

        const post: PostInputModel = {
            title: createString(31),
            shortDescription: createString(101),
            content: createString(1001),
            blogId: new ObjectId().toString(),
        };

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')
    });

    it('shouldn\'t update 401 not authorized', async () => {

        const post: PostInputModel = {
            title: 'Post 16',
            shortDescription: 'Short 16',
            content: 'Content 16',
            blogId: dataset2.blogs[1]._id.toString(),
        };

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            //.set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(401)

        console.log(res.text)
        expect(res.text).toEqual('Not authorized')
    });
});