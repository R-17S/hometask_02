import {NextFunction, Request, Response} from "express";
import {UserInputModel,} from "../../../models/userTypes";
import {authService} from "../auth-service";


export const registrationHandler = async (req:Request<{},{},UserInputModel>, res:Response, next:NextFunction) => {
    try {
        const { login, password, email } = req.body;
        const newUser = await authService.registerUser(login, password, email);
        res.sendStatus(204)
    } catch (error) {
        next(error);
    }
};