import {UserInputModel, UserViewModel} from "../../models/userTypes";
import {WithId} from "mongodb";
import {UserDbTypes} from "../../db/user-type";
import {usersRepository} from "./repositories/user-repositories";
import bcrypt from "bcrypt";
import {BadRequestException} from "../../helper/exceptions";



export const usersService = {
    async createUser(input: UserInputModel): Promise<UserViewModel> {
        const loginExists = await usersRepository.isUserExistOrError(input.login);
        const emailExists = await usersRepository.isUserExistOrError(input.email);

        if (loginExists) throw new BadRequestException('Login should be unique')
        if (emailExists) throw new BadRequestException('Email should be unique')

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);

        const newUser = {
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

    mapToUserViewModel(user: WithId<UserDbTypes>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },
}