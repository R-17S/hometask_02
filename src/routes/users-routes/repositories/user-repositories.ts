
import {UserModel} from "../../../db/user-type";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {NotFoundException} from "../../../helper/exceptions";

@injectable()
export class UsersRepository {
    async save(user: InstanceType<typeof UserModel>): Promise<void> {
        await user.save();
    }

    async findById(id: string): Promise<InstanceType<typeof UserModel> | null> {
        return UserModel.findById(id);
    }


    async findByLoginOrEmail(loginOrEmail: string): Promise<InstanceType<typeof UserModel> | null> {
        return UserModel.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    }

    async findByConfirmationCode(code: string): Promise<InstanceType<typeof UserModel> | null> {
        return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
    }

    async findByLoginOrEmailStrict(login: string, email: string): Promise<InstanceType<typeof UserModel> | null> {
        return UserModel.findOne({
            $or: [{ login }, { email }]
        });
    }

    async findByRecoveryCode(code: string): Promise<InstanceType<typeof UserModel> | null> {
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    async delete(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    async exists(id: string): Promise<boolean> {
        return !!(await UserModel.exists({ _id: new ObjectId(id) }));
    }

    async getUserLoginByIdOrError(userId: string): Promise<string> {
        const user = await UserModel.findById(userId).lean();
        if (!user) throw new NotFoundException('User not found');
        return user.login;
    }
}
