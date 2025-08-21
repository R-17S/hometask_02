
import {SETTINGS} from "../../../settings";
import jwt from 'jsonwebtoken';

export const jwtService =  {
    async createAccessToken(userId: string) {
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
    },

    async createRefreshToken(userId: string) {
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, { expiresIn: '20s' })
    },

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
        } catch (e) {
            return null;
        }
    },

    async getUserIdFromToken(token: string): Promise<string | null> {
        const payload = await this.verifyToken(token);
        return payload?.userId || null;
    }
};