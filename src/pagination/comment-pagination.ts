
import { Request } from 'express';
import {CommentInputQuery, CommentPaginationQueryResult} from "../models/commentTypes";


export const paginationQueryComment = (req: Request<{},{},{}, CommentInputQuery>): CommentPaginationQueryResult => {
    return {
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    };
};