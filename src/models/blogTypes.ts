

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


export type BlogQueryParams = {
    searchNameTerm?: string | null;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
};

export type PaginatedViewBlogs = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewModel[];
};
