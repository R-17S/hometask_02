import {Router} from "express";
import {overallUserValidation, userExistsValidator} from "./middleware-users/userValidators";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {container} from "../../inversify.config";

import {UsersController} from "./handlers/users-controller";

const usersController = container.get(UsersController);
export const usersRouter = Router();


// Роуты  для главной users
usersRouter.get('/', authBasicMiddleware, usersController.getUsers.bind(usersController));
usersRouter.post('/', ...overallUserValidation, usersController.createUser.bind(usersController));
usersRouter.delete('/:id', authBasicMiddleware, userExistsValidator, usersController.deleteUserById.bind(usersController));