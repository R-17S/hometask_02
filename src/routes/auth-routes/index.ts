import {Router} from "express";
import {
    overallAuthValidation,
    overallRegistrationValidator,
} from "./middleware-users/authValidators";
import {authJwtHandler} from "./handlers/authJwtHandler";
import {getCurrentUserHandler} from "./handlers/getCurrentUserHandler";
import {authJwtMiddleware} from "./middleware-users/authJwtMiddleware";
import {registrationHandler} from "./handlers/registrationUserHandler";
import {confirmRegistrationHandler} from "./handlers/confirmRegistrationHandler";
import {resendConfirmationEmailHandler} from "./handlers/resendConfirmationEmailHandler";
import {refreshTokenGuard} from "./middleware-users/refreshTokenGuard";
import {refreshTokenHandler} from "./handlers/refreshTokenHandler";
import {logoutHandler} from "./handlers/logoutHandler";
import {checkRefreshTokenCookie} from "./middleware-users/checkRefreshTokenCookie";


export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/login', ...overallAuthValidation, authJwtHandler);
authRouter.get('/me', authJwtMiddleware, getCurrentUserHandler);

// Роуты  для registration
authRouter.post('/registration', ...overallRegistrationValidator, registrationHandler);
authRouter.post('/registration-confirmation', confirmRegistrationHandler);
authRouter.post('/registration-email-resending', resendConfirmationEmailHandler);

// Роуты  для токенов
authRouter.post('/refresh-token', checkRefreshTokenCookie, refreshTokenGuard, refreshTokenHandler);
authRouter.post('/logout', checkRefreshTokenCookie, logoutHandler);