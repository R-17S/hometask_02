import {CommentPaginationQueryResult, CommentViewModel, CommentViewPaginated, MyLikeStatusTypes} from "../../../models/commentTypes";
import {WithId} from "mongodb";
import {CommentDbTypes, CommentModel} from "../../../db/comment-type";
import {NotFoundException} from "../../../helper/exceptions";
import {inject, injectable} from "inversify";
import {CommentsLikeService} from "../comments-like-service";

@injectable()
export class CommentsQueryRepository {
    constructor(
        @inject(CommentsLikeService) private commentLikesService: CommentsLikeService
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

        const items = await Promise.all(
            comments.map(async (comment) => {
                const myStatus = await this.commentLikesService.getMyStatus(userId, comment._id.toString());
                return this.mapToCommentViewModel(comment, myStatus);
            })
        );

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