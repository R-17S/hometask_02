import { Request, Response } from 'express';
import {authService} from "../auth-service";
import {AuthInputModel, AuthViewModel} from "../../../models/authType";
import {ErrorType} from "../../../models/errorsType";
import {jwtService} from "../application/jwt-service";


export const authController = async (req: Request<{},{},AuthInputModel>, res: Response<ErrorType | AuthViewModel>) => {
        // const { loginOrEmail, password } = req.body;
        const user = await authService.checkCredentials(req.body);

        if ('errorsMessage' in user) {
            res.status(401).json(user);
            return
        }

        if (user) {
            const token = await jwtService.createJWT(user);
            res.status(200).json({
                accessToken: token
            });
            return
        }
};