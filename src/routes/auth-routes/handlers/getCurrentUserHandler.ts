
import {Response, Request} from "express";
import {usersQueryRepository} from "../../users-routes/repositories/user-query-repository";
import {resultForHttpException} from "../../../helper/resultForHttpException";
import {ResultObject} from "../../../helper/resultClass";

export const getCurrentUserHandler = async (req: Request, res: Response) => {
    const user = await usersQueryRepository.getUserById(req.userId as string);
    const result = user
        ? ResultObject.Success(user)
        : ResultObject.NotFound('User not found', [
            { field: 'userId', message: 'No user found with provided id' }
        ]);

    resultForHttpException(res, result);
};


