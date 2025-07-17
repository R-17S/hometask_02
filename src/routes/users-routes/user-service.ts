import {UserInputModel, UserViewModel} from "../../models/userTypes";
import {WithId} from "mongodb";
import {UserDbTypes} from "../../db/user-type";
import {usersRepository} from "./repositories/user-repositories";
import bcrypt from "bcrypt";
import {BadRequestException} from "../../helper/exceptions";
import {bcryptService} from "../auth-routes/application/bcrypt-service";



export const usersService = {
    async createUser(input: UserInputModel): Promise<UserViewModel> {
        const [loginExists, emailExists] = await Promise.all([
            usersRepository.findByLoginOrEmail(input.login),
            usersRepository.findByLoginOrEmail(input.email)
        ]);

        if (loginExists) throw new BadRequestException('Login should be unique');
        if (emailExists) throw new BadRequestException('Email should be unique');

        const passwordHash = await bcryptService.generateHash(input.password);
        const newUser = {
            login: input.login,
            passwordHash,
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