import {BlogInputModel} from "../../src/models/blogTypes";
import {req} from "../datasets/test-client";
import {SETTINGS} from "../../src/settings";
import {authToken, blog1, createString, dataset1, dataset2} from "../datasets/datasets";
import {blogsCollection, postsCollection, runDb} from "../../src/db/mongoDB";
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
            id: expect.any(String),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        });

        const blogInDb = await blogsCollection.findOne({_id: ObjectId.createFromHexString(res.body.id)});
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

        expect(res.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: expect.arrayContaining([])
        });
    });

    it('should get not empty array', async () => {
        await blogsCollection.insertMany(dataset1.blogs)

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200);

        console.log(res.body);
        const expectedBlog = {
            id: dataset1.blogs[0]._id.toString(),
            name: dataset1.blogs[0].name,
            description: dataset1.blogs[0].description,
            websiteUrl: dataset1.blogs[0].websiteUrl,
            createdAt: dataset1.blogs[0].createdAt.toISOString(),
            isMembership: dataset1.blogs[0].isMembership
        };

        // expect(res.body).toHaveLength(1);
        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: expect.arrayContaining([expectedBlog])
        });
    });

    it('shouldn\'t get find 400', async () => {

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(400) // проверка на ошибку

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body).toEqual({
            errorsMessage: [{
                field: 'id',
                message: 'Invalid blog ID'
            }]
        });
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${nonExistentId}`)
            .expect(404)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Blog not found');
    });

    it('should get find 200', async () => {

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .expect(200)

        console.log(res.body)
        const expectedBlog = {
            id: dataset1.blogs[0]._id.toString(),
            name: dataset1.blogs[0].name,
            description: dataset1.blogs[0].description,
            websiteUrl: dataset1.blogs[0].websiteUrl,
            createdAt: dataset1.blogs[0].createdAt.toISOString(),
            isMembership: dataset1.blogs[0].isMembership
        };

        expect(res.body).toEqual(expectedBlog)
    });

    it('should delete', async () => {
        await blogsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset1.blogs)

        await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0]._id)
            .set('Authorization', `Basic ${authToken}`)
            .expect(204)

        const blogInDb = await blogsCollection.countDocuments({});
        expect(blogInDb).toBe(0);
    });

    it('shouldn\'t delete', async () => {

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set('Authorization', `Basic ${authToken}`)
            .expect(400) // проверка на ошибку

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid blog ID');
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const res = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${nonExistentId}`)
            .set('Authorization', `Basic ${authToken}`)
            .expect(404)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Blog not found');
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

        await req
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

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid blog ID');
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

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('id');
        expect(res.body.errorsMessage[0].message).toEqual('Blog not found');
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

    it('get should return 200 and paginated posts', async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset2.blogs);
        await postsCollection.insertMany(dataset2.posts);

        const testBlogId = dataset2.blogs[0]._id;
        const response = await req
            .get(`/blogs/${testBlogId}/posts`)
            .query({
                pageNumber: 1,
                pageSize: 10,
                sortBy: 'createdAt',
                sortDirection: 'desc'
            })
            .expect(200);

        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: expect.arrayContaining([
                expect.objectContaining({
                    title: 'Post 1',
                    shortDescription: 'Short 1',
                    content: 'Content 1',
                    blogId: blog1._id.toString(),
                    blogName: 'Blog 1',
                    //createdAt: expect.any(String)
                }),
            ])
        });
    });

    it('get should return 404 if blog not found', async () => {
        const nonExistentId = new ObjectId();
        const res = await req
            .get(`/blogs/${nonExistentId}/posts`)
            .expect(404);
        console.log(res.text)


        expect(res.text).toEqual('Blog not found');
    });

    it('get should return 400 if blogId is invalid', async () => {

        const res = await req
            .get(`/blogs/${1}/posts`)
            .expect(400)

        expect(res.body.errorsMessage.length).toEqual(1);
        expect(res.body.errorsMessage[0].field).toEqual('blogId');
        expect(res.body.errorsMessage[0].message).toEqual('Invalid blogId ID');
    });

    it('get should apply pagination correctly', async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await blogsCollection.insertMany(dataset2.blogs);
        // Создаем 15 тестовых постов
        const posts = Array.from({length: 15}, (_, i) => ({
            _id: new ObjectId(),
            title: `Post ${i}`,
            content: `Content ${i}`,
            shortDescription: `Short ${i}`,
            blogId: blog1._id.toString(),
            blogName: blog1.name,
            createdAt: new Date(2023, 0, i + 1)
        }));
        await postsCollection.insertMany(posts);

        const response = await req
            .get(`/blogs/${dataset2.blogs[0]._id}/posts`)
            .query({
                pageNumber: 2,
                pageSize: 5,
                sortBy: 'createdAt',
                sortDirection: 'asc'
            })
            .expect(200);

        expect(response.body).toEqual({
            pagesCount: 3, // 15 постов / 5 на странице = 3 страницы
            page: 2,
            pageSize: 5,
            totalCount: 15,
            items: expect.arrayContaining([
                expect.objectContaining({title: 'Post 5'}),
                expect.objectContaining({title: 'Post 6'}),
                expect.objectContaining({title: 'Post 7'}),
                expect.objectContaining({title: 'Post 8'}),
                expect.objectContaining({title: 'Post 9'})
            ])
        });
    });

    it('create should post for existing blog', async () => {
        const newPostData = {
            title: 'New Post',
            shortDescription: 'Short description',
            content: 'Post content'
        };

        const res = await req
            .post(`/blogs/${dataset2.blogs[0]._id}/posts`)
            .set('Authorization', `Basic ${authToken}`)
            .send(newPostData)
            .expect(201);

        expect(res.body).toEqual({
            id: expect.any(String),
            title: newPostData.title,
            shortDescription: newPostData.shortDescription,
            content: newPostData.content,
            blogId: dataset2.blogs[0]._id.toString(),
            blogName: dataset2.blogs[0].name,
            createdAt: expect.any(String)
        });
    });

    it('create should return 401 without authorization header', async () => {

        const newPostData = {
            title: 'New Post',
            shortDescription: 'Short description',
            content: 'Post content'
        };

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newPostData)
            .expect(401);

        expect(res.text).toBe('Not authorized')

        console.log(res.text)

        const blogInDb = await blogsCollection.countDocuments({})
        expect(blogInDb).toBe(2);
    });

    it('create should return 400 for invalid post data', async () => {

        const incorrectPost = {
            title: createString(31),
            shortDescription: createString(101),
            content: createString(1001),
        };

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${authToken}`)
            .send(incorrectPost)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(3);
        expect(res.body.errorsMessages[0].field).toEqual('name');
        expect(res.body.errorsMessages[1].field).toEqual('description');
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');

        const blogInDb = await blogsCollection.countDocuments({});
        expect(blogInDb).toBe(2);
    });
});

