import {CommentPaginationQueryResult, CommentViewModel, CommentViewPaginated, MyLikeStatusTypes} from "../../../models/commentTypes";
import {WithId} from "mongodb";
import {CommentDbTypes, CommentModel} from "../../../db/comment-type";
import {NotFoundException} from "../../../helper/exceptions";
import {inject, injectable} from "inversify";
import {CommentsLikeService} from "../comments-like-service";
import {CommentLikeRepository} from "./comment-like-repository";

@injectable()
export class CommentsQueryRepository {
    constructor(
        @inject(CommentsLikeService) private commentLikesService: CommentsLikeService,
        @inject(CommentLikeRepository) private commentLikeRepository: CommentLikeRepository,
    ) {}

    async  getCommentsByPostId (id: string, params: CommentPaginationQueryResult, userId: string): Promise<CommentViewPaginated> {
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = params;

        const filter = {postId:id};
        const [totalCount, comments] = await Promise.all([
            CommentModel.countDocuments(filter),
            CommentModel
                .find(filter)
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean()
        ]);
        const commentIds = comments.map(c => c._id.toString());
        const likes = await this.commentLikeRepository.findMany(userId, commentIds);

        const likeMap = new Map<string, MyLikeStatusTypes>();
        likes.forEach(like => {
            likeMap.set(like.commentId, like.status);
        })

        const items = comments.map(comment => {
                const myStatus =  likeMap.get(comment._id.toString()) ?? 'None';
                return this.mapToCommentViewModel(comment, myStatus);
        });


        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items
        };
    }

    async getCommentByIdOrError(id: string, userId: string): Promise<CommentViewModel> {
        const result = await CommentModel.findById(id).lean()
        if (!result) throw new NotFoundException("Comment not found");
        const myStatus = userId
            ? await this.commentLikesService.getMyStatus(userId, id)
            : 'None';
        return this.mapToCommentViewModel(result, myStatus);
    }

    mapToCommentViewModel(comment: WithId<CommentDbTypes>, myStatus: MyLikeStatusTypes): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount ?? 0,
                dislikesCount: comment.dislikesCount ?? 0,
                myStatus,
            }
        };
    }
}