import {Router} from "express";
import {checkRefreshTokenCookie} from "../auth-routes/middleware-auth/checkRefreshTokenCookie";
import {refreshTokenGuard} from "../auth-routes/middleware-auth/refreshTokenGuard";
import {getDevicesHandler} from "./handlers/getDevicesHandler";
import {rateLimitMiddleware} from "../../middlewares/rateLimit-middleware";
import {deleteOtherDevicesHandler} from "./handlers/deleteOtherDevicesHandler";
import {deleteDeviceHandler} from "./handlers/deleteDeviceHandler";



export const securityDevicesRoutes = Router();

securityDevicesRoutes.get('/', checkRefreshTokenCookie, refreshTokenGuard, getDevicesHandler);
securityDevicesRoutes.delete('/', rateLimitMiddleware, checkRefreshTokenCookie, refreshTokenGuard, deleteOtherDevicesHandler);
securityDevicesRoutes.delete('/:deviceId', rateLimitMiddleware, checkRefreshTokenCookie, refreshTokenGuard , deleteDeviceHandler);