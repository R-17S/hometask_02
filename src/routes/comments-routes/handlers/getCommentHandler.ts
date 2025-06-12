import {CommentViewModel} from "../../../models/commentTypes";
import {Response, Request} from "express";
import {commentsRepository} from "../repositories/comment-repository";


export const getCommentHandler = async (req: Request<{id: string}>, res: Response<CommentViewModel | null>) => {
    const foundComment = await commentsRepository.getCommentById(req.params.id);
    res.status(200).json(foundComment)
};