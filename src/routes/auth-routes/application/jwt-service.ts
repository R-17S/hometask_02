
import {SETTINGS} from "../../../settings";
import jwt from 'jsonwebtoken';

export const jwtService =  {
    async createAccessToken(userId: string, deviceId: string) {
        return jwt.sign({userId, deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
    },

    async createRefreshToken(userId: string, deviceId: string) {
        return jwt.sign({userId, deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '20s' })
    },

    async verifyToken(token: string): Promise<{ userId: string, deviceId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string, deviceId: string};
        } catch (e) {
            return null;
        }
    },

    async getPayloadFromToken(token: string): Promise<{ userId: string; deviceId: string } | null> {
        return await this.verifyToken(token);
    },

    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e) {
            return null;
        }
    }
};