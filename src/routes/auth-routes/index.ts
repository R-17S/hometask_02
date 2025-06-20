import {Router} from "express";
import {overallAuthValidation} from "./middleware-users/authValidators";
import {authJwtHandler} from "./handlers/authJwtHandler";
import {getCurrentUser} from "./handlers/getCurrentUser";
import {authJwtMiddleware} from "./middleware-users/authJwtMiddleware";


export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/login', ...overallAuthValidation, authJwtHandler);
authRouter.get('/me', authJwtMiddleware, getCurrentUser);
