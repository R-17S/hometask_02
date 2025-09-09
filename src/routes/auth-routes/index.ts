import {Router} from "express";
import {overallAuthValidation, overallRegistrationValidator,} from "./middleware-auth/authValidators";
import {authLoginHandler} from "./handlers/authLoginHandler";
import {getCurrentUserHandler} from "./handlers/getCurrentUserHandler";
import {accessTokenGuard} from "./middleware-auth/accessTokenGuard";
import {registrationHandler} from "./handlers/registrationUserHandler";
import {confirmRegistrationHandler} from "./handlers/confirmRegistrationHandler";
import {resendConfirmationEmailHandler} from "./handlers/resendConfirmationEmailHandler";
import {refreshTokenGuard} from "./middleware-auth/refreshTokenGuard";
import {refreshTokenHandler} from "./handlers/refreshTokenHandler";
import {logoutHandler} from "./handlers/logoutHandler";
import {checkRefreshTokenCookie} from "./middleware-auth/checkRefreshTokenCookie";
import {rateLimitMiddleware} from "../../middlewares/rateLimit-middleware";
import {contextMiddleware} from "./middleware-auth/requestContextMiddleware";


export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/login', rateLimitMiddleware, contextMiddleware, ...overallAuthValidation, authLoginHandler);
authRouter.get('/me', accessTokenGuard, getCurrentUserHandler);

// Роуты  для registration
authRouter.post('/registration', ...overallRegistrationValidator, registrationHandler);
authRouter.post('/registration-confirmation', confirmRegistrationHandler);
authRouter.post('/registration-email-resending', resendConfirmationEmailHandler);

// Роуты  для токенов
authRouter.post('/refresh-token', rateLimitMiddleware, checkRefreshTokenCookie, refreshTokenGuard, refreshTokenHandler);
authRouter.post('/logout', rateLimitMiddleware, checkRefreshTokenCookie, logoutHandler);