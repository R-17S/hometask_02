
export type UserInputModel = {
    login: string;
    password: string;
    email: string;
}

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;

};

export type UserInputQuery = {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
};

export type UserPaginationQueryResult = {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
};

export type UsersViewPaginated = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
};