import {UsersViewPaginated, UserViewModel, UserPaginationQueryResult} from "../../../models/userTypes";
import {UserDbTypes} from "../../../db/user-type";
import {usersCollection} from "../../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {UserAuthViewModel} from "../../../models/authType";
import {NotFoundException} from "../../../helper/exceptions";

export const usersQueryRepository = {
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
            usersCollection.countDocuments(filter),
            usersCollection
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(pageSize)
                .toArray()
        ]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(this.mapToUserViewModel),
        };
    },

    async findUserById(id: string): Promise<UserViewModel | null>  {
        const result = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!result) throw new NotFoundException("User not found");
        return this.mapToUserViewModel(result);
    },

    mapToUserViewModel(user: WithId<UserDbTypes>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },

    async getUserByIdOrError(userId: string): Promise<UserAuthViewModel> {
        const result = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!result) throw new NotFoundException("User not found");
        return this.mapToAuthUserViewModel(result);
    },

    mapToAuthUserViewModel (user: WithId<UserDbTypes>): UserAuthViewModel {
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    },
};