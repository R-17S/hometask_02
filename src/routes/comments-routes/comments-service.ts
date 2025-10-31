import {inject, injectable} from "inversify";
import {CommentInputModel, MyLikeStatusTypes} from "../../models/commentTypes";
import {ForbiddenException, NotFoundException} from "../../helper/exceptions";
import {CommentsRepository} from "./repositories/comment-repository";
import {CommentsLikeService} from "./comments-like-service";
import {CommentLikeRepository} from "./repositories/comment-like-repository";
import {CommentModel} from "../../db/comment-type";
import {UsersRepository} from "../users-routes/repositories/user-repositories";
import {PostsService} from "../posts-route/post-service";



@injectable()
export class CommentsService  {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsService) private postsService: PostsService,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(CommentsLikeService) private commentsLikeService: CommentsLikeService,
        @inject(CommentLikeRepository) private commentLikeRepository:CommentLikeRepository
    ) {}

    async createComment(input: CommentInputModel, postId: string, userId: string): Promise<string> {
        await this.postsService.checkPostExistsOrError(postId);
        const userLogin = await this.usersRepository.getUserLoginByIdOrError(userId);
        const comment = new CommentModel({
            content: input.content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            postId,
            createdAt: new Date(),
            likesCount: 0,
            dislikesCount: 0
        });

        await this.commentsRepository.save(comment);
        return comment._id.toString();
    }

    async updateComment(id: string, input: CommentInputModel): Promise<void> {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new Error('Comment not found');// потому что перед этим есть checkCommentOwnership

        comment.content = input.content;
        await this.commentsRepository.save(comment);
    }

    async checkCommentOwnership(commentId: string, userId: string): Promise<void> {
        const comment = await this.commentsRepository.findById(commentId);
        if (!comment) throw new NotFoundException("Comment not found");
        if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException("Cannot edit someone else's comment");
    }

    async deleteComment(id: string) {
        return await this.commentsRepository.delete(id);
    }

    async updateLikeStatus(commentId: string, userId: string, status: MyLikeStatusTypes): Promise<void> {
        await this.commentsLikeService.updateStatus(userId, commentId, status);
        const {likesCount, dislikesCount} = await this.commentsLikeService.getLikesCount(commentId);
        await this.commentLikeRepository.updateLikeCounts(commentId, likesCount, dislikesCount);
    }
}