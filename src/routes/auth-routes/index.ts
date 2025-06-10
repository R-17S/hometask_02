import {Router} from "express";
import {overallAuthValidation} from "./middleware-users/authValidators";
import {authHandler} from "./handlers/authHandler";


export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/login', ...overallAuthValidation, authHandler);
authRouter.get('/me', ...overallAuthValidation, authHandler);
