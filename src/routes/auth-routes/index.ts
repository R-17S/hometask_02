import {Router} from "express";
import {
    emailInputValidator, newPasswordValidator,
    overallAuthValidation,
    overallRegistrationValidator,
} from "./middleware-auth/authValidators";

import {getCurrentUserHandler} from "./handlers/getCurrentUserHandler";
import {accessTokenGuard} from "./middleware-auth/accessTokenGuard";
import {refreshTokenGuard} from "./middleware-auth/refreshTokenGuard";
import {checkRefreshTokenCookie} from "./middleware-auth/checkRefreshTokenCookie";
import {rateLimitMiddleware} from "../../middlewares/rateLimit-middleware";
import {container} from "../../inversify.config";
import {AuthController} from "./handlers/auth-controller";



const authController = container.get(AuthController);
export const authRouter = Router();


// Роуты  для главной users
authRouter.post('/login', rateLimitMiddleware, ...overallAuthValidation, authController.authLogin.bind(authController));
authRouter.get('/me', accessTokenGuard, getCurrentUserHandler);

// Роуты  для registration
authRouter.post('/registration', rateLimitMiddleware, ...overallRegistrationValidator, authController.registration.bind(authController));
authRouter.post('/registration-confirmation', rateLimitMiddleware, authController.confirmRegistration.bind(authController));
authRouter.post('/registration-email-resending', rateLimitMiddleware, authController.resendConfirmationEmail.bind(authController));

// Роуты  для токенов
authRouter.post('/refresh-token', rateLimitMiddleware, checkRefreshTokenCookie, refreshTokenGuard, authController.refreshToken.bind(authController));
authRouter.post('/logout', rateLimitMiddleware, checkRefreshTokenCookie,refreshTokenGuard, authController.logout.bind(authController));

// Роуты  для пароля
authRouter.post('/password-recovery', rateLimitMiddleware, ...emailInputValidator, authController.passwordRecovery.bind(authController));
authRouter.post('/new-password', rateLimitMiddleware, newPasswordValidator, authController.newPassword.bind(authController))