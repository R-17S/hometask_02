import {Request, Response} from "express";
import {BlogInputQuery, BlogsViewPaginated} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../repositories/blog-query-repository";
import {paginationQueryBlog} from "../../../pagination/blog-pagination";
import {ResultObject} from "../../../helper/resultClass";
import {resultForHttpException} from "../../../helper/resultForHttpException";

export const getBlogsHandler = async (req: Request<{},{},{}, BlogInputQuery>, res: Response<BlogsViewPaginated>) => {
    try {
        const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = paginationQueryBlog(req);
        const blogs = await blogsQueryRepository.getAllBlogs({
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        });

        resultForHttpException(res, blogs);


    } catch (error) {
        const errorResult = ResultObject.ServerError(
            'Get failed',
            [{field: null, message: 'Database error'}]
        );
        resultForHttpException(res, errorResult);

    }
};