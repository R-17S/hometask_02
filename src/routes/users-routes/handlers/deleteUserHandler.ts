import {NextFunction, Request, Response} from 'express';
import {UsersService} from "../user-service";


export const deleteUserHandler = async (req: Request<{id:string}>, res: Response, next:NextFunction) => {
    try {
        await UsersService.deleteUser(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}