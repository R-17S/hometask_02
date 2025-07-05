import {CommentViewModel} from "../../../models/commentTypes";
import {Response, Request, NextFunction} from "express";
import {commentQueryRepository} from "../repositories/comment-query-repository";


export const getCommentHandler = async (req: Request<{id: string}>, res: Response<CommentViewModel>, next:NextFunction) => {
    try {
        const foundComment = await commentQueryRepository.getCommentByIdOrError(req.params.id);
        res.status(200).json(foundComment)
    } catch (error) {
        next(error);
    }
};