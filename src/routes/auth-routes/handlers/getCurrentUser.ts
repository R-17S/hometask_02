import {UserAuthViewModel} from "../../../models/authType";
import {Response, Request} from "express";
import {usersQueryRepository} from "../../users-routes/repositories/user-query-repository";

export const getCurrentUser = async (req: Request, res: Response<UserAuthViewModel | { error: string }>) => {
    try {
        if (!req.userId) {
            res.status(500).json({error: 'Not authorized'});
            return
        }
        // Even though authJwtMiddleware validates the token and sets userId,
        // we still need to check if the user exists in the database
        // because the user might have been deleted after the token was issued
        const user = await usersQueryRepository.findUserById(req.userId);
        if (!user) {
            res.sendStatus(404);
            return
        }

        res.status(200).json(user)
        return
    } catch (error) {
        console.error('GetCurrentUser error:', error);
        res.status(400).json({error: 'Internal server error'});
        return
    }
}
