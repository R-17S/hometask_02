import {Request, Response} from 'express';
import {UserInputModel, UserViewModel} from "../../../models/userTypes";
import {usersService} from "../user-service";
import {ErrorType} from "../../../models/errorsType";

export const createUserHandler = async (req:Request<{},{},UserInputModel>, res:Response<UserViewModel |  ErrorType>) => {
    const newUser = await usersService.createUser(req.body);
    if ('errorsMessage' in newUser) {
        res.status(400).json(newUser);
        return
    }
    res.status(201).send(newUser);
};