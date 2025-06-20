import { Request, Response } from 'express';
import {authService} from "../auth-service";
import {AuthInputModel, AuthViewModel} from "../../../models/authType";
import {ErrorType} from "../../../models/errorsType";
import {jwtService} from "../application/jwt-service";


export const authJwtHandler = async (req: Request<{},{},AuthInputModel>, res: Response<ErrorType | AuthViewModel>) => {
        // const { loginOrEmail, password } = req.body;
        const authResult = await authService.checkCredentials(req.body);

        if ('errorsMessage' in authResult) {
            res.status(401).json(authResult);
            return;
        }

        const token = await jwtService.createJWT(authResult);
        res.status(200).json({accessToken: token});
        return;
};