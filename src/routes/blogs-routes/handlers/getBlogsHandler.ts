import {Request, Response} from "express";
import {BlogInputQuery, BlogsViewPaginated} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../repositories/blog-query-repository";

export const getBlogsHandler = async (req: Request<{},{},{}, BlogInputQuery>, res: Response<BlogsViewPaginated>) => {
    // const { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = paginationQueryBlog(req);
    const blogs = await blogsQueryRepository.getAllBlogs({
        searchNameTerm: req.query.searchNameTerm || null,
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
    });
    res.status(200).json(blogs);
};