import {NextFunction, Request, Response} from 'express';
import {UserInputModel, UserViewModel} from "../../../models/userTypes";
import {UsersService} from "../user-service";


export const createUserHandler = async (req:Request<{},{},UserInputModel>, res:Response<UserViewModel>, next:NextFunction) => {
    try {
        const newUser = await UsersService.createUser(req.body);
        res.status(201).send(newUser);
    } catch (error) {
        next(error);
    }
};