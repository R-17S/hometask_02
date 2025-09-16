

export type UserDbTypes = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    emailConfirmation?: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
    passwordRecovery?: {
        recoveryCode: string;
        expirationDate: Date;
    }
};