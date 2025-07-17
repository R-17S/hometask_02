import {NextFunction, Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../models/blogTypes";
import {blogsService} from "../blog-service";
import {blogsQueryRepository} from "../repositories/blog-query-repository";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {ResultObject} from "../../../helper/resultClass";
import {ResultStatus} from "../../../helper/result-status.enum";


export const createBlogHandler = async (req: Request<{},{},BlogInputModel>, res: Response<BlogViewModel>, next:NextFunction) => {
    try {
        const newBlog = await blogsService.createBlog(req.body);
        if (newBlog.status !== ResultStatus.Success) {
            resultForHttpException(res, newBlog);
        } //  на всякий случай, вдруг добавится бизнес-логика, которая будет возвращать другие статусы
        const newBlogId = await blogsQueryRepository.getBlogByIdOrError(newBlog.data.toString());
        resultForHttpException(res, newBlogId);
    } catch (error) {
        const errorResult = ResultObject.ServerError(
            'Create failed',
            [{field: null, message: 'Database error'}]
        );
        resultForHttpException(res, errorResult);

    }
};