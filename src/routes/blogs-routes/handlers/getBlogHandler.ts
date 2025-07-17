import {Request, Response} from "express";
import {BlogViewModel} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../repositories/blog-query-repository";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {ResultObject} from "../../../helper/resultClass";

export const getBlogHandler = async (req: Request<{id: string}>, res: Response<BlogViewModel>) => {
    try {
        const foundBlog = await blogsQueryRepository.getBlogByIdOrError(req.params.id);
        resultForHttpException(res, foundBlog);
    } catch (error) {
        const errorResult = ResultObject.ServerError(
            'Get failed',
            [{field: null, message: 'Database error'}]
        );
        resultForHttpException(res, errorResult);

    }
};