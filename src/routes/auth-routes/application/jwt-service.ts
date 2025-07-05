import {UserDbTypes} from "../../../db/user-type";
import {SETTINGS} from "../../../settings";
import jwt from 'jsonwebtoken';
import {WithId} from "mongodb";

export const jwtService =  {
    async createJWT(user: WithId<UserDbTypes>) {
        return jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET, { expiresIn: '1h' })
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