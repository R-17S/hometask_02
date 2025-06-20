import {Router} from "express";
import {getUsersHandler} from "./handlers/getUsersHandler";
import {createUserHandler} from "./handlers/createUserHandler";
import {overallUserValidation, userExistsValidator} from "./middleware-users/userValidators";
import {deleteUserHandler} from "./handlers/deleteUserHandler";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";


export const usersRouter = Router();


// Роуты  для главной users
usersRouter.get('/', getUsersHandler);
usersRouter.post('/', ...overallUserValidation, createUserHandler);
usersRouter.delete('/:id', authBasicMiddleware, userExistsValidator, deleteUserHandler);