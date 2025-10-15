
import {CommentsService} from "../../src/routes/comments-routes/comments-service";
import {CommentModel} from "../../src/db/comment-type";
import {CommentsRepository} from "../../src/routes/comments-routes/repositories/comment-repository";
import {PostsRepository} from "../../src/routes/posts-route/repositories/post-repositories";

import {CommentsLikeService} from "../../src/routes/comments-routes/comments-like-service";
import {CommentLikeRepository} from "../../src/routes/comments-routes/repositories/comment-like-repository";
import {Types} from "mongoose";
import {UsersRepository} from "../../src/routes/users-routes/repositories/user-repositories";
import {PostsService} from "../../src/routes/posts-route/post-service";
import {BlogsRepository} from "../../src/routes/blogs-routes/repositories/blog-repositories";


// переписать тест
describe('UNIT', () => {
    const commentsRepository = new CommentsRepository();
    const postsRepository = new PostsRepository();
    const blogsRepository = new BlogsRepository();
    const usersRepository = new UsersRepository();
    const commentLikeRepository = new CommentLikeRepository();
    const postsService = new PostsService(postsRepository, blogsRepository);
    const commentsLikeService = new CommentsLikeService(commentLikeRepository);
    const commentsService= new CommentsService(commentsRepository, postsService, usersRepository, commentsLikeService, commentLikeRepository);

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('should return false if comment not found', async () => {
        jest.spyOn(CommentModel, 'findById').mockReturnValue({
            lean: () => Promise.resolve(null) // возвращаем null как будто комментарий не найден
        } as any);
        await expect(commentsService.updateLikeStatus('comment-id', 'user-id','Like', ))
            .rejects.toThrow('Comment not found');
        expect(CommentModel.findById).toHaveBeenCalledWith('comment-id');
    })

    it('should update existing like', async () => {
        // Так тут мокаем поиск
        // jest.spyOn(CommentModel, 'findById').mockReturnValue({
        //     lean: () => Promise.resolve({ _id: 'comment-id' })
        // } as any);
        //jest.spyOn(commentsRepository, 'getCommentById').mockResolvedValue({ _id: 'comment-id' } as any);


        //Тут мокаем commentsLikeService
        // jest.spyOn(CommentLikeModel, 'findOne').mockResolvedValue({
        //     status: 'Like',
        //     _id: new Types.ObjectId(),
        //     __v: 0,
        // } as any);
        const updateStatusMock = jest.spyOn(commentsLikeService, 'updateStatus').mockResolvedValue();
        jest.spyOn(commentLikeRepository, 'find').mockResolvedValue({ status: 'Dislike',
            _id: new Types.ObjectId(),
            __v: 0,
        } as any);
        const saveMock = jest.spyOn(commentLikeRepository, 'save').mockResolvedValue();

        // Тут мокаем сохранение лайка
        // jest.spyOn(CommentLikeModel, 'findOneAndUpdate').mockResolvedValue({ _id: 'like-id' });

        // Тут мокаем счётчик, но он не мокается
        // jest.spyOn(CommentLikeModel, 'countDocuments')
        //     .mockImplementation((filter) => {
        //         if (filter.status === 'Like') return Promise.resolve(5);
        //         if (filter.status === 'Dislike') return Promise.resolve(2);
        //         return Promise.resolve(0);
        //     });
        jest.spyOn(commentsLikeService, 'getLikesCount').mockResolvedValue({ likesCount: 5, dislikesCount: 2 });

        // Тут мокаем обновление счётчика
        //const updateCountsMock = jest.spyOn(CommentModel, 'updateOne').mockResolvedValue({ modifiedCount: 1 });
        const updateCountsMock = jest.spyOn(commentLikeRepository, 'updateLikeCounts').mockResolvedValue();

        await commentsService.updateLikeStatus('comment-id', 'user-id', 'Like');
        expect(updateStatusMock).toHaveBeenCalledWith('user-id', 'comment-id', 'Like');
        expect(updateCountsMock).toHaveBeenCalledWith('comment-id', 5, 2);
    });

    it('should create new like if not exists', async () => {
        //тут мокаем и возвращаем, что комент найден
        //jest.spyOn(commentsRepository, 'getCommentById').mockResolvedValue({ _id: 'comment-id' } as any);
        //тут мокаем commentLikeRepository внутри commentsLikeService
        jest.spyOn(commentLikeRepository, 'find').mockResolvedValue(null);
        //if (currentState?.status === status) return; внутри из за проверки не проходит
        const saveMock = jest.spyOn(commentLikeRepository, 'save').mockResolvedValue();
        // Тут мокаем счётчик
        jest.spyOn(commentsLikeService, 'getLikesCount').mockResolvedValue({ likesCount: 1, dislikesCount: 0 });
        // Тут мокаем обновление счётчика
        const updateCountsMock = jest.spyOn(commentLikeRepository, 'updateLikeCounts').mockResolvedValue();


        await commentsService.updateLikeStatus('comment-id', 'user-id', 'Like');
        expect(saveMock).toHaveBeenCalledWith('user-id', 'comment-id', 'Like');
        expect(updateCountsMock).toHaveBeenCalledWith('comment-id', 1, 0);
    });
});

