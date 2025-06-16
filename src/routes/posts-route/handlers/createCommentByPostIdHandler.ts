import {Request, Response} from "express";
import {CommentInputModel, CommentViewModel} from "../../../models/commentTypes";
import {commentsService} from "../../comments-routes/comments-service";
import {commentQueryRepository} from "../../comments-routes/repositories/comment-query-repository";




export const createCommentByPostIdHandler = async (req: Request<{postId: string},{},CommentInputModel>, res: Response<CommentViewModel | null>) => {
    const newComment = await commentsService.createComment(req.body, req.params.postId);
    if (!newComment)  {
        res.sendStatus(404);
        return
    }
    const newCommentId = await commentQueryRepository.getCommentById(newComment.toString());
    res.status(201).send(newCommentId)
}