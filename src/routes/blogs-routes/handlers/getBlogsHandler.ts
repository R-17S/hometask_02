import {NextFunction, Request, Response} from "express";
import {BlogInputQuery, BlogsViewPaginated} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../repositories/blog-query-repository";
import {paginationQueryBlog} from "../../../pagination/blog-pagination";

export const getBlogsHandler = async (req: Request<{},{},{}, BlogInputQuery>, res: Response<BlogsViewPaginated>, next:NextFunction) => {
    try {
        const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = paginationQueryBlog(req);
        const blogs = await blogsQueryRepository.getAllBlogs({
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        });
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};