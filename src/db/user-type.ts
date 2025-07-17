


export type UserDbTypes = {
    login: string;
    email: string;
    passwordHash: string;  // Изменил с password на passwordHash
    createdAt: Date;
    emailConfirmation?: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
};