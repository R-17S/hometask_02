import {UserDbTypes} from "../../../db/user-type";
import {SETTINGS} from "../../../settings";
import jwt from 'jsonwebtoken';

export const jwtService =  {
    async createJWT(user: UserDbTypes) {
        const token  = jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET, { expiresIn: '1h' })
        return token;
    }
}