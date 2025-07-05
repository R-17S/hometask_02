

export type BlogInputModel = {
    name: string;
    description: string;
    websiteUrl: string;
};


export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};


export type BlogInputQuery = {
    searchNameTerm?: string | null;
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: string;
};

export type BlogPaginationQueryResult = {
    searchNameTerm: string | null;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
};

export type BlogsViewPaginated = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewModel[];
};
