import {inject, injectable} from "inversify/lib/esm";
import {NextFunction, Request, Response} from "express";
import {UserInputModel, UserInputQuery, UsersViewPaginated, UserViewModel} from "../../../models/userTypes";
import {UsersService} from "../user-service";
import {paginationQueryUser} from "../../../pagination/user-pagination";
import {UsersQueryRepository} from "../repositories/user-query-repository";


@injectable()
export class UsersController {
    constructor(
        @inject(UsersService) private usersService: UsersService,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    ) {}

    async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>, next: NextFunction) {
        try {
            const newUser = await this.usersService.createUser(req.body);
            res.status(201).send(newUser);
        } catch (error) {
            next(error);
        }
    }


    async deleteUserById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            await this.usersService.deleteUser(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req: Request<{}, {}, {}, UserInputQuery>, res: Response<UsersViewPaginated>, next: NextFunction) {
        try {
            const {
                sortBy,
                sortDirection,
                pageNumber,
                pageSize,
                searchLoginTerm,
                searchEmailTerm
            } = paginationQueryUser(req);
            const users = await this.usersQueryRepository.getAllUsers({
                sortBy,
                sortDirection,
                pageNumber,
                pageSize,
                searchLoginTerm,
                searchEmailTerm,
            });
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}
