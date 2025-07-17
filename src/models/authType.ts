

export type AuthInputModel = {
    loginOrEmail: string,
    password: string
}

export type AuthViewModel = {
    accessToken: string;
}

export type UserAuthViewModel = {
    email: string;
    login: string;
    userId: string;
};

export type ConfirmRegistrationInputModel = {
    code: string;
};

export type ConfirmRegistrationViewModel = {
    isConfirmed: boolean;
};

export type ResendConfirmationEmailInputModel = {
    email: string;
};

export type ResendConfirmationViewModel = {
    isEmailResent: boolean;
};