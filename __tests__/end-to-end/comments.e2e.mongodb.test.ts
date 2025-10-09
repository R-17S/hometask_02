
import {dataset3, dataset4} from "../datasets/datasets";
import {SETTINGS} from "../../src/settings";
import {req} from "../datasets/test-client";
import {ObjectId} from "mongodb";
import {JwtService} from "../../src/routes/auth-routes/application/jwt-service";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {BlogModel} from "../../src/db/blog-type";
import {PostModel} from "../../src/db/post-type";
import {UserModel} from "../../src/db/user-type";
import {CommentModel} from "../../src/db/comment-type";



describe('/comments', () => {
    const jwtService = new JwtService();
    const deviceId = 'test-device-id';
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        await mongoose.connect(SETTINGS.MONGO_URL)
        await BlogModel.deleteMany({})
        await PostModel.deleteMany({})
        await UserModel.deleteMany({})
        await CommentModel.deleteMany({})

    })
    afterAll(async () => {
        await mongoose.disconnect()
    })

    it('should update', async () => {
        await CommentModel.deleteMany({})
        await CommentModel.insertMany(dataset4.comments);

        // 2. Подготовка данных для запроса
        const testComment = {
            ...dataset4.comments[0],
            _id: new ObjectId()
        };
        await CommentModel.insertOne(testComment);
        console.log(testComment);
        const updateData = {
            content: 'Updated comment content with valid length'
        };

        // 3. Создаем токен автора комментария
        const token = await jwtService.createAccessToken(testComment.commentatorInfo.userId, deviceId);


        const res = await req
            .put(`${SETTINGS.PATH.COMMENTS}/${testComment._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .expect(204);
        console.log(res.body);


        const updatedComment = await CommentModel.findOne({_id: testComment._id});
        expect(updatedComment?.content).toBe(updateData.content);
    });

    it('update should return 401 without authorization header', async () => {
        const { _id: commentId } = dataset4.comments[0];


        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
            .send({ content: 'Any content' })
            .expect(401);
    });

    it('update should return 403 when trying to update another users comment', async () => {
        const jwtService = new JwtService();
        const deviceId = 'test-device-id';
        const { _id: commentId } = dataset4.comments[0];
        const otherUser = dataset4.users[1];
        const token = await jwtService.createAccessToken(otherUser._id.toString(), deviceId);


        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Attempt to update others comment' })
            .expect(403);
    });

    it('update should return 404 for non-existent comment', async () => {
        const user = dataset4.users[0];
        const jwtService = new JwtService();
        const deviceId = 'test-device-id';
        const token = await jwtService.createAccessToken(user._id.toString(), deviceId);


        await req
            .put(SETTINGS.PATH.COMMENTS + '/65d33a1b8c7d4e3f1a2b3c99')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Content for non-existent comment' })
            .expect(404);
    });

    it('update should return 400 for invalid comment data', async () => {
        const {_id: commentId, commentatorInfo} = dataset4.comments[0];
        const token = await jwtService.createAccessToken(commentatorInfo.userId, deviceId);


        const response = await req
            .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Short' })
            .expect(400);

        expect(response.body).toEqual({
            errorsMessages: [
                {
                    field: 'content',
                    message: 'Comment must be no longer than 300 characters and shorter than 20'
                }
            ]
        });
    });

    it('update should return 401 with expired token', async () => {
        const { _id: commentId, commentatorInfo } = dataset4.comments[0];

        // Генерируем токен с истекшим сроком
        const expiredToken = jwt.sign(
            { userId: commentatorInfo.userId },
            process.env.JWT_SECRET!,
            { expiresIn: '-1h' }
        );

        await req
            .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
            .set('Authorization', `Bearer ${expiredToken}`)
            .send({ comment: 'Content with expired token' })
            .expect(401);
    });


    it ('get should return 200', async () => {
        await CommentModel.deleteMany({});
        const testComment = {
            ...dataset4.comments[0],
            _id: new ObjectId()
        };
        await CommentModel.insertOne(testComment);

        // 2. Исправленный URL (без лишней скобки)
        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${testComment._id.toString()}`)
            .expect(200);


        const expectedComment= {
            id: testComment._id.toString(),
            content: testComment.content,
            commentatorInfo: {
                userId: testComment.commentatorInfo.userId,
                userLogin: testComment.commentatorInfo.userLogin
            },
            createdAt: testComment.createdAt.toISOString(),
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: 'None'
            }
        };
        expect(res.body).toEqual(expectedComment)
    });

    it('get should return 404 when comment does not exist', async () => {
        const nonExistingCommentId = new ObjectId().toString();
        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${nonExistingCommentId}`)
            .expect(404);
        console.log(res)
    });

    it('get should return 400 when comment id is invalid', async () => {
        const invalidCommentId = 'invalidCommentId';
        const res = await req
            .get(`${SETTINGS.PATH.COMMENTS}/${invalidCommentId}`)
            .expect(400);

        expect(res.body).toEqual({
            errorsMessage: [
                {
                    field: 'id',
                    message: 'Invalid comment ID'
                }
            ]
        });
    });


    it ('delete should return 204', async () => {
        await CommentModel.deleteMany({});
        const testComment = {
            ...dataset4.comments[3],
            _id: new ObjectId() // Генерируем новый ID для изоляции теста
        };
        await CommentModel.insertOne(testComment);
        const token = await jwtService.createAccessToken(testComment.commentatorInfo.userId, deviceId);

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${testComment._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const deletedComment = await CommentModel.findOne({
            _id: testComment._id
        });
        expect(deletedComment).toBeNull();

        // Проверяем количество оставшихся комментариев (0, так как удалили единственный)
        const remainingComments = await CommentModel.countDocuments({});
        expect(remainingComments).toBe(0);

        // const commentsInDb = await usersCollection.countDocuments({});
        // expect(commentsInDb).toBe(3);
    });

    it ('delete should return 400 when commentId is invalid', async () => {
        const invalidCommentId = 'invalidCommentId';
        const testComment  = dataset4.comments[0];
        const token = await jwtService.createAccessToken(testComment.commentatorInfo.userId, deviceId);
        const res = await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${invalidCommentId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        expect(res.body).toEqual({
            errorsMessage: [
                {
                    field: 'commentId',
                    message: 'Invalid commentId ID'
                }
            ]
        });
    });

    it('shouldn\'t get find 404', async () => {

        const nonExistentId = new ObjectId();
        const testComment  = dataset4.comments[0];
        const token = await jwtService.createAccessToken(testComment.commentatorInfo.userId, deviceId);
        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    });

    it ('delete should return 401 without authorization header', async () => {

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset3.users[0]._id)
            //.set('Authorization', `Bearer ${token}`)
            .expect(401)

        expect(res.text).toBe('Not authorized');

        console.log(res.text);
    });
});