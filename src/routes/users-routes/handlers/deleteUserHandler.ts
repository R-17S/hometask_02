import {NextFunction, Request, Response} from 'express';
import {usersService} from "../user-service";


export const deleteUserHandler = async (req: Request<{id:string}>, res: Response, next:NextFunction) => {
    try {
        await usersService.deleteUser(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}