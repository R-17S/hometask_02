import {Request, Response, NextFunction} from 'express';
import {ResendConfirmationEmailInputModel} from "../../../models/authType";
import {authService} from "../auth-service";




export const resendConfirmationEmailHandler = async (req: Request<{}, {}, ResendConfirmationEmailInputModel>, res: Response, next: NextFunction) => {
    try {
        const {email} = req.body;
        await authService.resendConfirmationEmail(email);
        res.sendStatus(204); // Email отправлен успешно
    } catch (error) {
        next(error);
    }
};