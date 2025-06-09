
import {authRepository} from "./repositories/auth-repositories";
import bcrypt from "bcrypt";
import {AuthInputModel} from "../../models/authType";
import {ErrorType} from "../../models/errorsType";
import {UserDbTypes} from "../../db/user-type";


export const authService = {
    async checkCredentials(input: AuthInputModel): Promise<ErrorType | UserDbTypes> {
        const user = await authRepository.findByLoginOrEmail(input.loginOrEmail);
        if (!user) {
            return {
                errorsMessage: [{field: "Login or Email", message: 'Invalid login or email'}]
            };
        }

        const validPassword = await bcrypt.compare(input.password, user.password);
        if (!validPassword) {
            return {
                errorsMessage: [{field: "Password", message: 'Invalid password'}]
            };
        }
        return user;
    }
};
