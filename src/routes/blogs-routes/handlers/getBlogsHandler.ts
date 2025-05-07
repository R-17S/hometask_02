import {Request, Response} from "express";
import {BlogQueryParams, PaginatedViewBlogs} from "../../../models/blogTypes";
import {blogsQueryRepository} from "../blog-queryRepositories";

export const getBlogsHandler = async (req: Request<{},{},{}, BlogQueryParams>, res: Response<PaginatedViewBlogs>) => {
    const blogs = await blogsQueryRepository.getAllBlogs({
        searchNameTerm: req.query.searchNameTerm || null,
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
    });
    res.status(200).json(blogs);
}