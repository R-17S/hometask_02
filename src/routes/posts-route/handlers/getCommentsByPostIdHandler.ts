import {Request, Response} from "express";
import {CommentInputQuery, CommentViewPaginated} from "../../../models/commentTypes";
import {commentQueryRepository} from "../../comments-routes/repositories/comment-query-repository";
import {postsService} from "../post-service";
import {ErrorType} from "../../../models/errorsType";

export const getCommentsByPostIdHandler = async (req: Request<{postId: string},{},{},CommentInputQuery>, res: Response<CommentViewPaginated | ErrorType>) => {
    const  postExists = await postsService.checkPostExists(req.params.postId);
    if (!postExists) {
        res.status(404).json({errorsMessage:[ {field: 'postId', message: 'Post not found'}]});
        return
    }

    const commentByPostId = await  commentQueryRepository.getCommentsByPostId(req.params.postId,
        {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
        }
    );

    res.status(200).json(commentByPostId);
};
