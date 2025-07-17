import {Request, Response, NextFunction} from "express";
import {ConfirmRegistrationInputModel} from "../../../models/authType";
import {authService} from "../auth-service";


export const confirmRegistrationHandler = async (req: Request<{}, {}, ConfirmRegistrationInputModel>, res: Response, next: NextFunction) => {
    try {
        const {code} = req.body;
        await authService.confirmRegistration(code)
        res.sendStatus(204)
    } catch (error) {
        next(error);
    }
}