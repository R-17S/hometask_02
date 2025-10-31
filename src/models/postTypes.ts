

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
    "extendedLikesInfo": {
        "likesCount": number,
        "dislikesCount": number,
        "myStatus": 'Like' | 'Dislike' | 'None',
        newestLikes: Array<{
            addedAt: Date;
            userId: string;
            login: string;
        }>;
    };
};

export type PostInputQuery = {
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
};

export type PostPaginationQueryResult = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
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