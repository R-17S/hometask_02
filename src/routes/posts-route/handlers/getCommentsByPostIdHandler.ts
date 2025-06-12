import {Request, Response} from "express";
import {CommentInputQuery, CommentViewPaginated} from "../../../models/commentTypes";
import {commentQueryRepository} from "../../comments-routes/repositories/comment-query-repository";

export const getCommentsByPostIdHandler = async (req: Request<{postId: string},{},{},CommentInputQuery>, res: Response<CommentViewPaginated>) => {
    const commentByPostId = await  commentQueryRepository.getCommentsByPostId(req.params.postId,
        {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
    );

    if (!commentByPostId) {
        res.sendStatus(404);
        return
    }

    res.status(200).json(commentByPostId);
};
