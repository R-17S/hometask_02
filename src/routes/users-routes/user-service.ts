import {UserInputModel, UserViewModel} from "../../models/userTypes";
import {WithId} from "mongodb";
import {UserDbTypes} from "../../db/user-type";
import {UsersRepository} from "./repositories/user-repositories";
import {BadRequestException} from "../../helper/exceptions";
import {bcryptService} from "../auth-routes/application/bcrypt-service";
import {inject, injectable} from "inversify/lib/esm";


@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async createUser(input: UserInputModel): Promise<UserViewModel> {
        const [loginExists, emailExists] = await Promise.all([
            this.usersRepository.findByLoginOrEmail(input.login),
            this.usersRepository.findByLoginOrEmail(input.email)
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

        const createdUser = await this.usersRepository.createUser(newUser);
        return this.mapToUserViewModel(createdUser);
    }

    async deleteUser(id:string) {
        return await this.usersRepository.deleteUser(id);
    }

    mapToUserViewModel(user: WithId<UserDbTypes>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}