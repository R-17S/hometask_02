import {Request, Response} from "express";
import {UsersViewPaginated, UserInputQuery} from "../../../models/userTypes";
import {usersQueryRepository} from "../repositories/user-query-repository";


export const getUsersHandler = async (req: Request<{},{},{},UserInputQuery>, res: Response<UsersViewPaginated>) => {
    const users = await usersQueryRepository.getAllUsers({
        sortBy: req.query.sortBy || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        searchLoginTerm: req.query.searchLoginTerm || null,
        searchEmailTerm: req.query.searchEmailTerm || null,
    });
    res.status(200).json(users);
}