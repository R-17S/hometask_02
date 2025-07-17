import {Router} from "express";
import {overallAuthValidation, registrationValidator} from "./middleware-users/authValidators";
import {authJwtHandler} from "./handlers/authJwtHandler";
import {getCurrentUserHandler} from "./handlers/getCurrentUserHandler";
import {authJwtMiddleware} from "./middleware-users/authJwtMiddleware";
import {registrationHandler} from "./handlers/registrationUserHandler";
import {confirmRegistrationHandler} from "./handlers/confirmRegistrationHandler";
import {resendConfirmationEmailHandler} from "./handlers/resendConfirmationEmailHandler";


export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/login', ...overallAuthValidation, authJwtHandler);
authRouter.get('/me', authJwtMiddleware, getCurrentUserHandler);

authRouter.post('/registration', registrationValidator, registrationHandler);
authRouter.post('/registration-confirmation', confirmRegistrationHandler);
authRouter.post('/registration-email-resending', resendConfirmationEmailHandler);
