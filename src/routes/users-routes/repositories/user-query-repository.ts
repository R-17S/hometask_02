import {UsersViewPaginated, UserViewModel, UserPaginationQueryResult} from "../../../models/userTypes";
import {UserDbTypes, UserModel} from "../../../db/user-type";
import {ObjectId, WithId} from "mongodb";
import {UserAuthViewModel} from "../../../models/authType";
import {NotFoundException} from "../../../helper/exceptions";
import {injectable} from "inversify";


@injectable()
export class UsersQueryRepository {
    async getAllUsers(params: UserPaginationQueryResult): Promise<UsersViewPaginated> {
        const {
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm,
        } = params;

        const filter: any = {};
        if (searchLoginTerm && searchEmailTerm) {
            filter.$or = [
                {login: {$regex: searchLoginTerm, $options: 'i'}},
                {email: {$regex: searchEmailTerm, $options: 'i'}}
            ];
        }

        const sortOptions: Record<string, 1 | -1> = {
            [sortBy]: sortDirection === 'asc' ? 1 : -1,
        };

        const skip = (pageNumber - 1) * pageSize;

        const [totalCount, users] = await Promise.all([
            UserModel.countDocuments(filter),
            UserModel
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(pageSize)
                .lean()
        ]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(this.mapToUserViewModel),
        };
    }

    async findUserById(id: string): Promise<UserViewModel | null>  {
        const result = await UserModel.findOne({ _id: new ObjectId(id) }).lean();
        if (!result) throw new NotFoundException("User not found");
        return this.mapToUserViewModel(result);
    }

    mapToUserViewModel(user: WithId<UserDbTypes>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    }

    async getUserById(userId: string): Promise<UserAuthViewModel | null> {
        const result = await UserModel.findById(userId).lean();
        return result ? this.mapToAuthUserViewModel(result) : null;
    }

    mapToAuthUserViewModel (user: WithId<UserDbTypes>): UserAuthViewModel {
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }
}