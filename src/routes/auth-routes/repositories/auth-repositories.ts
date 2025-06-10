import {usersCollection} from "../../../db/mongoDB";
import {UserDbTypes} from "../../../db/user-type";
import {ObjectId} from "mongodb";
import {UserAuthViewModel} from "../../../models/authType";




export const authRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbTypes | null> {
        return usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    },
    // async findByLoginOrEmail(loginOrEmail: string): Promise<{password: string} | null> {
    //     return usersCollection.findOne({
    //         $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    //     }, { projection: { password: 1, _id: 1 } });
    // },
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
