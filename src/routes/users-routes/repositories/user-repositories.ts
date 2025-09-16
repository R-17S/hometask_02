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

    async getUserByLoginOrEmail(login: string, email: string): Promise<UserDbTypes | null> {
        return usersCollection.findOne({
            $or: [{ login }, { email }]
        });
    },

    async findByConfirmationCode(code: string): Promise<WithId<UserDbTypes> | null> {
        return usersCollection.findOne({
            'emailConfirmation.confirmationCode': code
        });
    },

    async updateConfirmationStatus(userId: string): Promise<void> {
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { 'emailConfirmation.isConfirmed': true } }
        );
    },

    async userExists(id: string): Promise<boolean> {
        const result = await usersCollection.countDocuments({_id: new ObjectId(id)});
        return  result > 0;
    },

    async findByEmail(email: string): Promise<WithId<UserDbTypes> | null> {
        return usersCollection.findOne({ email });
    },

    async updateConfirmationCode(userId: string, newCode: string, newExpirationDate: Date): Promise<void> {
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    'emailConfirmation.confirmationCode': newCode,
                    'emailConfirmation.expirationDate': newExpirationDate
                }
            }
        );
    },

    async saveRecoveryCode(userId: string, recoveryCode: string, expirationDate: Date): Promise<void> {
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    passwordRecovery: {
                        recoveryCode,
                        expirationDate
                    }
                }
            }
        )
    },


    async findByRecoveryCode(recoveryCode: string): Promise<WithId<UserDbTypes> | null> {
        return usersCollection.findOne({
            'passwordRecovery.recoveryCode': recoveryCode
        });
    },

    async updatePassword(userId: ObjectId, passwordHash: string): Promise<void> {
        await usersCollection.updateOne(
            { _id: userId },
            { $set: { passwordHash } }
        );
    },

    async clearRecoveryCode(userId: ObjectId): Promise<void> {
        await usersCollection.updateOne(
            { _id: userId },
            { $unset: { passwordRecovery: '' } }
        );
    }
};
