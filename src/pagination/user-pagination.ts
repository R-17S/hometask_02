
import { Request } from 'express';
import {UserInputQuery, UserPaginationQueryResult} from "../models/userTypes";

export const paginationQueryUser = (req: Request<{},{},{}, UserInputQuery>): UserPaginationQueryResult => {
    return {
        sortBy: req.query.sortBy ? String(req.query.sortBy) : 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc',
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        searchLoginTerm: req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null,
        searchEmailTerm: req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null,
    };
};
