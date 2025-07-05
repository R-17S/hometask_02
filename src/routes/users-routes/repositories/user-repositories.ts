import {usersCollection} from "../../../db/mongoDB";
import {UserDbTypes} from "../../../db/user-type";
import {ObjectId, WithId} from "mongodb";
import {NotFoundException} from "../../../helper/exceptions";


export const usersRepository = {
    async createUser(newUser: UserDbTypes): Promise<WithId<UserDbTypes>> {
        const result = await usersCollection.insertOne(newUser);
        return {
            ...newUser,
            _id: result.insertedId
        };
    },

    async deleteUser(id:string) {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    },

    async isUserExistOrError(loginOrEmail: string): Promise<'login' | 'email'> {
        const user = await usersCollection.findOne({
            $or : [{login: loginOrEmail}, {email: loginOrEmail}]
        });
        if (!user) throw new NotFoundException('User not found');
        return user.login === loginOrEmail? 'login' : 'email';
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbTypes> | null> {
        return usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    },

    async userExists(id: string): Promise<boolean> {
        const result = await usersCollection.countDocuments({_id: new ObjectId(id)});
        return  result > 0;
    },

};
