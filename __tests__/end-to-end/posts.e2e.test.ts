import {db, setDB} from "../../src/db/db";
import {authToken, createString, dataset1, dataset2} from "../datasets/datasets";
import {PostInputModel} from "../../src/models/postTypes";
import {SETTINGS} from "../../src/settings";
import {req} from "../datasets/test-client";



describe('/posts', () => {
    beforeAll(async () => {
        setDB()
    });

    it(`should create newPost`, async () => {
        setDB(dataset1)
        const newPost: PostInputModel = {
            title: 'Post 1',
            shortDescription: 'Short 1',
            content: 'Content 1',
            blogId: dataset1.blogs[0]._id.toString(),
        };
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newPost)
            .expect(201)

        console.log(res.body)

        expect(res.body).toEqual(db.posts[0])
        expect(res.body.title).toEqual(newPost.title);
        expect(res.body.shortDescription).toEqual(newPost.shortDescription);
        expect(res.body.content).toEqual(newPost.content);
        expect(res.body.blogId).toEqual(newPost.blogId);
        expect(res.body.blogName).toEqual(dataset1.blogs[0].name);
        expect( typeof res.body.id).toEqual('string');
    });

    it(`should/n't create 401 not authorized`, async () => {
        setDB(dataset1)
        const newPost: PostInputModel = {
            title: 'Post 1',
            shortDescription: 'Short 1',
            content: 'Content 1',
            blogId: dataset1.blogs[0]._id.toString(),
        };
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            //.set('Authorization', `Basic ${authToken}`)
            .send(newPost)
            .expect(401)
        expect(res.text).toBe('Not authorized')

        console.log(res.text)
        expect(db.posts.length).toEqual(0)
    });

    it (`shouldn\'t create 400 bad validation`, async () => {
        setDB()
        const newPost: PostInputModel = {
            title: createString(31),
            shortDescription: createString(101),
            content: createString(1001),
            blogId: '1',
        };
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic ${authToken}`)
            .send(newPost)
            .expect(400)

        //console.log(res.body)
        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

        expect(db.posts.length).toEqual(0)
    });

    it ('should get empty array', async () => {
        setDB()

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        console.log(res.body)
        expect(res.body.length).toEqual(0)
    });

    it('should get not empty array', async () => {
        setDB(dataset2)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toEqual(1)
        expect(res.body[0]).toEqual(dataset2.posts[0]);
    });

    it ('shouldn\'t get find 404', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(404)

        // console.log(res.body)
    });

    it('should get find 200', async () => {
        setDB(dataset2)

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .expect(200)

        console.log(res.body)
        expect(res.body).toEqual(dataset2.posts[0]);
    });

    it ('should delete', async () => {
        setDB(dataset2)

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        console.log(res.body)
        expect(db.posts.length).toEqual(0)
    });

    it ('shouldn\'t delete', async () => {
        setDB(dataset2)

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(404)

        //console.log(res.body)
        //expect(db.posts.length).toEqual(1)
    });

    it ('shouldn\'t delete 401 not authorized', async () => {
        setDB(dataset2)

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            //.set('Authorization', `Basic ${authToken}`)
            .expect(401)

        console.log(res.body)
    });

    it('should update', async () => {
        setDB(dataset2)
        const post: PostInputModel = {
            title: 'Post 15',
            shortDescription: 'Short 15',
            content: 'Content 15',
            blogId: dataset2.blogs[1]._id.toString(),
        };

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(204)

        console.log(res.body)

        expect(db.posts[0]).toEqual({...db.posts[0], ...post, blogName: dataset2.blogs[0].name});
        });

    it('shouldn\'t update 404', async () => {
        setDB(dataset2)
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
            .expect(404)

        console.log(res.body)
    });

    it (`shouldn\'t update 400 bad validation`, async () => {
        setDB(dataset2)
        const post: PostInputModel = {
            title: createString(31),
            shortDescription: createString(101),
            content: createString(1001),
            blogId: '1',
        };

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .send(post)
            .expect(400)

        console.log(res.body)
        expect(db).toEqual(dataset2)
        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')
    });

    it('shouldn\'t update 401 not authorized', async () => {
        setDB(dataset2)
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
        expect(db).toEqual(dataset2)
    });




})