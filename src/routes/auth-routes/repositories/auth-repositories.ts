import {usersCollection} from "../../../db/mongoDB";
import {UserDbTypes} from "../../../db/user-type";




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
};
