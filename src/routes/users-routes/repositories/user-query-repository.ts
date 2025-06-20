import {UsersViewPaginated, UserInputQuery, UserViewModel} from "../../../models/userTypes";
import {UserDbTypes} from "../../../db/user-type";
import {usersCollection} from "../../../db/mongoDB";
import {ObjectId} from "mongodb";
import {UserAuthViewModel} from "../../../models/authType";

export const usersQueryRepository = {
    async getAllUsers(params: UserInputQuery): Promise<UsersViewPaginated> {
        const {
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10,
            searchLoginTerm = null,
            searchEmailTerm = null,
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

    async getUserById(id: string): Promise<UserViewModel | null>  {
        const result = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!result) return null;
        return this.mapToUserViewModel(result);
    },

    mapToUserViewModel(user: UserDbTypes): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },

    async findUserById(userId: string): Promise<UserAuthViewModel | null> {
        const result = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!result) return null;
        return this.mapToAuthUserViewModel(result);
    },

    mapToAuthUserViewModel (user: UserDbTypes): UserAuthViewModel {
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    },
};