
import {UserDbTypes, UserModel} from "../../../db/user-type";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async createUser(newUser: UserDbTypes): Promise<WithId<UserDbTypes>> {
        return await UserModel.create(newUser);
    }

    async deleteUser(id:string) {
        const result = await UserModel.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }


    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbTypes> | null> {
        return UserModel.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        }).lean();
    }

    async getUserByLoginOrEmail(login: string, email: string): Promise<WithId<UserDbTypes> | null> {
        return UserModel.findOne({
            $or: [{ login }, { email }]
        }).lean();
    }

    async findByConfirmationCode(code: string): Promise<WithId<UserDbTypes> | null> {
        return UserModel.findOne({
            'emailConfirmation.confirmationCode': code
        }).lean();
    }

    async updateConfirmationStatus(userId: string): Promise<void> {
        await UserModel.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { 'emailConfirmation.isConfirmed': true } }
        );
    }

    async userExists(id: string): Promise<boolean> {
        const result = await UserModel.exists({_id: new ObjectId(id)});
        return  !!result;
    }

    async findByEmail(email: string): Promise<WithId<UserDbTypes> | null> {
        return UserModel.findOne({ email }).lean();
    }

    async updateConfirmationCode(userId: string, newCode: string, newExpirationDate: Date): Promise<void> {
        await UserModel.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    'emailConfirmation.confirmationCode': newCode,
                    'emailConfirmation.expirationDate': newExpirationDate
                }
            }
        );
    }

    async saveRecoveryCode(userId: string, recoveryCode: string, expirationDate: Date): Promise<void> {
        await UserModel.updateOne(
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
    }


    async findByRecoveryCode(recoveryCode: string): Promise<WithId<UserDbTypes> | null> {
        return UserModel.findOne({
            'passwordRecovery.recoveryCode': recoveryCode
        }).lean();
    }

    async updatePassword(userId: ObjectId, passwordHash: string): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            { $set: { passwordHash } }
        );
    }

    async clearRecoveryCode(userId: ObjectId): Promise<void> {
        await UserModel.updateOne(
            { _id: userId },
            { $unset: { passwordRecovery: '' } }
        );
    }
}
