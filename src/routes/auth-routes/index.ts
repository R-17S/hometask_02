import {Router} from "express";
import {overallAuthValidation} from "./middleware-users/authValidators";
import {authController} from "./handlers/authHandler";


export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/', ...overallAuthValidation, authController);
