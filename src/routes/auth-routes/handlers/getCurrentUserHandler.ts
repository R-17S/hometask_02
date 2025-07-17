import {UserAuthViewModel} from "../../../models/authType";
import {Response, Request, NextFunction} from "express";
import {usersQueryRepository} from "../../users-routes/repositories/user-query-repository";

export const getCurrentUserHandler = async (req: Request, res: Response<UserAuthViewModel>, next:NextFunction) => {
    try {
        const user = await usersQueryRepository.getUserByIdOrError(req.userId as string);
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
}
