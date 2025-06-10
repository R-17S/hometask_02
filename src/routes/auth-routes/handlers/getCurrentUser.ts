import {UserAuthViewModel} from "../../../models/authType";
import {authRepository} from "../repositories/auth-repositories";
import {Response, Request} from "express";

export const getCurrentUser = async (req: Request, res: Response<UserAuthViewModel | { error: string }>) => {
    try {
        if (!req.userId) {
            return res.status(401).json({error: 'Not authorized'});
        }
        const user = await authRepository.findUserById(req.userId);
        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user)
    } catch (error) {
        console.error('GetCurrentUser error:', error);
        return res.status(400).json({error: 'Internal server error'});
    }
}