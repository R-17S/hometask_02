import {NextFunction, Request, Response} from "express";
import {CommentInputQuery, CommentViewPaginated} from "../../../models/commentTypes";
import {commentQueryRepository} from "../../comments-routes/repositories/comment-query-repository";
import {postsService} from "../post-service";
import {paginationQueryComment} from "../../../pagination/comment-pagination";

export const getCommentsByPostIdHandler = async (req: Request<{postId: string},{},{},CommentInputQuery>, res: Response<CommentViewPaginated>, next:NextFunction) => {
    try {
        await postsService.checkPostExists(req.params.postId);
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryComment(req);
        const commentByPostId = await commentQueryRepository.getCommentsByPostId(req.params.postId,
            {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection
            }
        );

        res.status(200).json(commentByPostId);
    } catch (error) {
        next(error);
    }
};
