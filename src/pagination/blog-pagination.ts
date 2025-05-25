
import { Request } from 'express';

export const paginationQueryBlog = (req: Request) => {
    return {
        searchNameTerm: req.query.searchNameTerm? String(req.query.searchNameTerm) : null,
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ? req.query.sortBy.toString() : 'createdAt',
        sortDirection: req.query.sortDirection &&  req.query.sortDirection.toString() === 'asc' ? 'asc' : 'desc',
    };
};