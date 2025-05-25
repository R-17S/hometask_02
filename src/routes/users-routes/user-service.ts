import {UserInputModel, UserViewModel} from "../../models/userTypes";
import {ObjectId} from "mongodb";
import {UserDbTypes} from "../../db/user-type";
import {usersRepository} from "./repositories/user-repositories";
import {ErrorType} from "../../models/errorsType";
import bcrypt from "bcrypt";



export const usersService = {
    async createUser(input: UserInputModel): Promise<UserViewModel | ErrorType> {
        const loginExists = await usersRepository.isUserExist(input.login);
        const emailExists = await usersRepository.isUserExist(input.email);

        const errors: ErrorType['errorsMessage'] = [];

        if (loginExists) {
            errors.push({field: 'login', message: 'login should be unique'});
        }
        if (emailExists) {
            errors.push({field: 'email', message: 'email should be unique'});
        }

        if (errors.length > 0) {
            return { errorsMessage: errors };
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        const newUser = {
            _id: new ObjectId(),
            login: input.login,
            password: passwordHash,
            email: input.email,
            createdAt: new Date(),
        };

        const createdUser = await usersRepository.createUser(newUser);
        return this.mapToUserViewModel(createdUser);
    },

    async deleteUser(id:string) {
        return await usersRepository.deleteUser(id);
    },

    mapToUserViewModel(user: UserDbTypes): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },
}