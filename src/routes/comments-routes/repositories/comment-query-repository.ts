import {CommentInputQuery, CommentViewModel, CommentViewPaginated} from "../../../models/commentTypes";
import {commentsCollection} from "../../../db/mongoDB";
import {ObjectId} from "mongodb";
import {CommentDbTypes} from "../../../db/comment-type";

export const commentQueryRepository = {
    async  getCommentsByPostId (id: string, params: CommentInputQuery): Promise<CommentViewPaginated> {
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = params;

        const filter = {postId: id};
        const [totalCount, comments] = await Promise.all([
            commentsCollection.countDocuments(filter),
            commentsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        ]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(this.mapToCommentViewModel)
        };
    },

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const result = await commentsCollection.findOne({_id: new ObjectId(id)})
        if (!result) return null;
        return this.mapToCommentViewModel(result);
    },

    mapToCommentViewModel(input: CommentDbTypes): CommentViewModel {
        return {
            id: input._id.toString(),
            content: input.content,
            commentatorInfo: {
                userId: input.commentatorInfo.userId,
                userLogin: input.commentatorInfo.userLogin,
            },
            createdAt: input.createdAt
        };
    },
}