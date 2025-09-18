import {Router} from "express";
import {checkRefreshTokenCookie} from "../auth-routes/middleware-auth/checkRefreshTokenCookie";
import {refreshTokenGuard} from "../auth-routes/middleware-auth/refreshTokenGuard";
import {rateLimitMiddleware} from "../../middlewares/rateLimit-middleware";
import {container} from "../../inversify.config";
import {SecurityDeviceController} from "./handlers/securityDevice-controller";


const securityDeviceController = container.get(SecurityDeviceController);
const securityDevicesRoutes = Router();

securityDevicesRoutes.get('/', checkRefreshTokenCookie, refreshTokenGuard, securityDeviceController.getDevices.bind(securityDeviceController));
securityDevicesRoutes.delete('/', rateLimitMiddleware, checkRefreshTokenCookie, refreshTokenGuard, securityDeviceController.deleteOtherDevices.bind(securityDeviceController));
securityDevicesRoutes.delete('/:deviceId', rateLimitMiddleware, checkRefreshTokenCookie, refreshTokenGuard , securityDeviceController.getDevices.bind(securityDeviceController));