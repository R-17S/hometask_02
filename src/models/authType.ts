

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