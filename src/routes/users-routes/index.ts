import {Router} from "express";
import {getUsersHandler} from "./handlers/getUsersHandler";
import {createUserHandler} from "./handlers/createUserHandler";
import {overallUserValidation, userExistsValidator} from "./middleware-users/userValidators";
import {deleteUserHandler} from "./handlers/deleteUserHandler";
import {authBasicMiddleware} from "../../middlewares/autorization-middleware";
import {container} from "../../inversify.config";
import {BlogsController} from "../blogs-routes/handlers/blogs-controller";
import {UsersController} from "./handlers/users-controller";

const usersController = container.get(UsersController);
const usersRouter = Router();


// Роуты  для главной users
usersRouter.get('/', authBasicMiddleware, usersController.getUsers.bind(usersController));
usersRouter.post('/', ...overallUserValidation, usersController.createUser.bind(usersController));
usersRouter.delete('/:id', authBasicMiddleware, userExistsValidator, usersController.deleteUserById.bind(usersController));