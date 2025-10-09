import mongoose from "mongoose";


export type TokenDbTypes = {
    token: string,
    revokedAt: Date,
    userId: string
};

const tokenSchema = new mongoose.Schema<TokenDbTypes>({
    token: { type: String, required: true },
    revokedAt: { type: Date, required: true },
    userId: { type: String, required: true },
})

export const TokenModel = mongoose.model<TokenDbTypes>("Tokens", tokenSchema)

