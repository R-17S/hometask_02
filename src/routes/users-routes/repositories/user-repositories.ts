import {usersCollection} from "../../../db/mongoDB";
import {UserDbTypes} from "../../../db/user-type";
import {ObjectId} from "mongodb";


export const usersRepository = {
    async createUser(newUser: UserDbTypes): Promise<UserDbTypes> {
        await usersCollection.insertOne(newUser);
        return newUser;
    },

    async deleteUser(id:string) {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    },

    async isUserExist(loginOrEmail: string): Promise<'login' | 'email' | null> {
        const user = await usersCollection.findOne({
            $or : [{login: loginOrEmail}, {email: loginOrEmail}]
        });
        if (!user) return null;
        return user.login === loginOrEmail? 'login' : 'email';
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbTypes | null> {
        return usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    },


};
