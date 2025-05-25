
import {authRepository} from "./repositories/auth-repositories";
import bcrypt from "bcrypt";
import {AuthInputModel} from "../../models/authType";
import {ErrorType} from "../../models/errorsType";


export const authService = {
    async checkCredentials(input: AuthInputModel): Promise< ErrorType | { success: true }> {
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
        return {success: true};
    }
};
