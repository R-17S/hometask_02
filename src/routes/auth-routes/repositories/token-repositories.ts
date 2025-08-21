
import {tokenCollection} from "../../../db/mongoDB";

export const tokenRepository =  {
    async exists(token: string): Promise<boolean> {
        const found = await tokenCollection.findOne({ token });
        return !!found;
    },

    async save(token: string, userId: string): Promise<void> {
        await tokenCollection.insertOne({
            token,
            userId,
            revokedAt: new Date()
        });
    }
};