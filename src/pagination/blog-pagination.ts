
import { Request } from 'express';
import {BlogInputQuery, BlogPaginationQueryResult} from "../models/blogTypes";

export const paginationQueryBlog = (req: Request<{},{},{}, BlogInputQuery>): BlogPaginationQueryResult => {
    return {
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : null,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    };
};