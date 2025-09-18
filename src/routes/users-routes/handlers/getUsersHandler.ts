import {NextFunction, Request, Response} from "express";
import {UsersViewPaginated, UserInputQuery} from "../../../models/userTypes";
import {UsersQueryRepository} from "../repositories/user-query-repository";
import {paginationQueryUser} from "../../../pagination/user-pagination";


export const getUsersHandler = async (req: Request<{},{},{},UserInputQuery>, res: Response<UsersViewPaginated>, next:NextFunction) => {
    try {
        const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = paginationQueryUser(req);
        const users = await UsersQueryRepository.getAllUsers({sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm,});
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}