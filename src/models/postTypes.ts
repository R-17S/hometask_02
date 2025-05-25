

export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}


export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: Date;
}

export type PostInputQuery = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
};

export type PostsViewPaginated = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModel[];
}

export type PostByBlogIdInputModel = {
    title: string,
    shortDescription: string,
    content: string,
}