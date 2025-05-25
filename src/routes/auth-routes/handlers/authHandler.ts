import { Request, Response } from 'express';
import {authService} from "../auth-service";
import {AuthInputModel} from "../../../models/authType";


export const authController = async (req: Request<{},{},AuthInputModel>, res: Response) => {
        // const { loginOrEmail, password } = req.body;
        const user = await authService.checkCredentials(req.body);

        if ('errorsMessage' in user) {
            res.status(401).json(user);
            return
        }
        res.sendStatus(204);
};