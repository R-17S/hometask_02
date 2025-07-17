import {NextFunction, Request, Response} from 'express';
import {authService} from "../auth-service";
import {AuthInputModel, AuthViewModel} from "../../../models/authType";
import {jwtService} from "../application/jwt-service";


export const authJwtHandler = async (req: Request<{},{},AuthInputModel>, res: Response<AuthViewModel>, next:NextFunction) => {
    try {
        const authResult = await authService.checkCredentials(req.body);
        const token = await jwtService.createJWT(authResult);
        res.status(200).json({accessToken: token});
        return;
    } catch (error) {
        next(error);
    }
};