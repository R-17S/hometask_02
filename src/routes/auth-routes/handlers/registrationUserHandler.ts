import {Request, Response} from "express";
import {UserInputModel,} from "../../../models/userTypes";
import {authService} from "../auth-service";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {Result} from "../../../helper/resultTypes";
import {WithId} from "mongodb";
import {UserDbTypes} from "../../../db/user-type";


export const registrationHandler = async (req:Request<{},{},UserInputModel>, res:Response<Result<null>>) => {
    const { login, password, email } = req.body;
    const newUser = await authService.registerUser(login, password, email);
    resultForHttpException(res, newUser);

};