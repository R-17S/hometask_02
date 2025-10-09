
import {authToken, createString, dataset2, dataset4, post1, user1, user2} from "../datasets/datasets";
import {PostInputModel} from "../../src/models/postTypes";
import {SETTINGS} from "../../src/settings";
import {req} from "../datasets/test-client";
import {ObjectId} from "mongodb";
import {JwtService} from "../../src/routes/auth-routes/application/jwt-service";
import mongoose from "mongoose";
import {PostModel} from "../../src/db/post-type";
import {BlogModel} from "../../src/db/blog-type";
import {UserModel} from "../../src/db/user-type";
import {CommentModel} from "../../src/db/comment-type";



describe('/posts', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        await mongoose.connect(SETTINGS.MONGO_URL)
        await PostModel.deleteMany({})
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

    it('should create newPost', async () => {

        const testBlog = await BlogModel.create({
            name: 'Test Blog',
            description: 'Test',
            websiteUrl: 'https://test.com',
            createdAt: new Date(),
            isMembership: false
        });
        console.log(testBlog)

        const newPost = {
            title: 'Create Post',
            shortDescription: 'Create Short',
            content: 'Create Content',
            blogId: testBlog._id.toString(), // Используем ID созданного блога
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

        const postInDb = await PostModel.countDocuments({});
        expect(postInDb).toBe(1);
    });

    it ('should get empty array', async () => {
        await PostModel.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

        expect(res.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    });

    it('should get not empty array', async () => {
        await PostModel.insertMany(dataset2.posts)

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

        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [expectedPost]
        });
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

        console.log(res.text)
        //expect(res.text).toEqual('Post not found');
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
        await PostModel.deleteMany({});
        await PostModel.insertMany(dataset2.posts)

        await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        const postInDb = await PostModel.countDocuments({});
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

    it('shouldn\'t delete find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .delete(`${SETTINGS.PATH.POSTS}/${nonExistentId}`)
            .set('Authorization', `Basic ${authToken}`)
            .expect(404)

        console.log(res.text)
        expect(res.body).toEqual({
            errorsMessage: [
                { field: 'id', message: 'Post not found' }
            ]
        });
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
        await PostModel.deleteMany({});
        await BlogModel.insertMany(dataset2.blogs);
        await PostModel.insertMany(dataset2.posts);

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

        const updateBlog = await PostModel.findOne({_id: dataset2.posts[0]._id});

        expect(updateBlog?.title).toBe(post.title)
        expect(updateBlog?.shortDescription).toBe(post.shortDescription)
        expect(updateBlog?.content).toBe(post.content)
        expect(updateBlog?.blogId.toString()).toBe(post.blogId)
        expect(updateBlog?.blogName).toBe(dataset2.posts[0].blogName)
        expect(updateBlog?.createdAt.toISOString()).toBe(dataset2.posts[0].createdAt.toISOString())

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

        console.log(res.text)
        expect(res.body).toEqual({
            errorsMessage: [
                { field: 'id', message: 'Post not found' }
            ]
        });
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

    it('get should  return 200 and paginated comment', async () => {
        await PostModel.deleteMany({});
        await UserModel.deleteMany({});
        await CommentModel.deleteMany({});
        await PostModel.insertMany(dataset4.posts);
        await UserModel.insertMany(dataset4.users);
        await CommentModel.insertMany(dataset4.comments);

        const testPostId = dataset4.posts[0]._id;
        const res = await req
            .get(`/posts/${testPostId}/comments`)
            .query({
                pageNumber: 1,
                pageSize: 10,
                sortBy: 'createdAt',
                sortDirection: 'desc'
            })
            .expect(200);
        console.log(res.body);

        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    content: 'This is first comment content for post 1',
                    commentatorInfo: {
                        userId: user1._id.toString(),
                        userLogin: user1.login
                    }
                }),
                expect.objectContaining({
                    content: 'Another comment for post 1 with different author',
                    commentatorInfo: {
                        userId: user2._id.toString(),
                        userLogin: user2.login
                    }
                })
            ])
        });
    });

    it('get should return 404 if post not found', async () => {
        const nonExistentId = new ObjectId();
        const res = await req
            .get(`/posts/${nonExistentId}/comments`)
            .expect(404);

        console.log(res.text)
        expect(res.text).toEqual('Post not found');
    });

    it('get should return 400 if postId is invalid', async () => {

        const res = await req
            .get(`/posts/${11325745}/comments`)
            .expect(400)

        expect(res.body.errorsMessage).toEqual([{
            field: 'postId',
            message: 'Invalid postId ID'
        }]);
    });

    it('get should return 200 and paginated comments', async () => {
        await PostModel.deleteMany({});
        await UserModel.deleteMany({});
        await CommentModel.deleteMany({});
        await PostModel.insertMany(dataset4.posts);
        await UserModel.insertMany(dataset4.users);
        // Создаем 15 тестовых коментов
        const comments = Array.from({length: 15}, (_, i) => ({
            _id: new ObjectId(),
            content: `This is comment ${i}`,
            commentatorInfo: {
                userId: user1._id.toString(),
                userLogin: user1.login
            },
            postId: post1._id.toString(),
            createdAt: new Date(2023, 0, i + 1)
        }));
        await CommentModel.insertMany(comments);

        const res = await req
            .get(`/posts/${dataset4.posts[0]._id}/comments`)
            .query({
                pageNumber: 2,
                pageSize: 5,
                sortBy: 'createdAt',
                sortDirection: 'asc'
            })
            .expect(200);

        expect(res.body).toEqual({
            pagesCount: 3, // 15 постов / 5 на странице = 3 страницы
            page: 2,
            pageSize: 5,
            totalCount: 15,
            items: expect.arrayContaining([
                expect.objectContaining({content: 'This is comment 5'}),
                expect.objectContaining({content: 'This is comment 6'}),
                expect.objectContaining({content: 'This is comment 7'}),
                expect.objectContaining({content: 'This is comment 8'}),
                expect.objectContaining({content: 'This is comment 9'}),
            ])
        });
    });

    it('create should comment for existing post', async () => {
        const jwtService = new JwtService();
        const deviceId = 'test-device-id';
        const newCommentData = {
            content: 'Valid comment length is 20 characters'
        };
        const testComment  = dataset4.comments[0];
        const token = await jwtService.createAccessToken(testComment.commentatorInfo.userId, deviceId)


        const res = await req
            .post(`/posts/${dataset4.posts[0]._id}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send(newCommentData)
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            content: newCommentData.content,
            commentatorInfo: {
                userId: user1._id.toString(),
                userLogin: user1.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: 'None'
            }
        });
    });

    it('create should return 401 without authorization header', async () => {

        const newCommentData = {
            content: 'Comment content'
        };

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newCommentData)
            .expect(401);

        expect(res.text).toBe('Not authorized')

        console.log(res.text)
    });

    it('create should return 400 for invalid comment data', async () => {
        const jwtService = new JwtService();
        const deviceId = 'test-device-id';
        const incorrectPost = {
            content: createString(301),
        };

        const testComment  = dataset4.comments[0];
        const token = await jwtService.createAccessToken(testComment.commentatorInfo.userId, deviceId)


        const res = await req
            .post(`/posts/${dataset4.posts[0]._id}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send(incorrectPost)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(1);
        expect(res.body.errorsMessages).toEqual([{
            field: 'content',
            message: 'Comment must be no longer than 300 characters and shorter than 20'
        }]);
    });

});