import {CommentViewModel} from "../../../models/commentTypes";
import {Response, Request} from "express";
import {commentQueryRepository} from "../repositories/comment-query-repository";


export const getCommentHandler = async (req: Request<{id: string}>, res: Response<CommentViewModel | null>) => {
    const foundComment = await commentQueryRepository.getCommentById(req.params.id);
    res.status(200).json(foundComment)
};