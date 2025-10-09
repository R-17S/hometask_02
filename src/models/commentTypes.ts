
export type CommentInputModel = {
    content: string;
};

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    "likesInfo": {
        "likesCount": number,
        "dislikesCount": number,
        "myStatus": 'Like' | 'Dislike' | 'None',
    }
};

export type CommentInputQuery = {
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
};

export type CommentPaginationQueryResult = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
};


export type CommentViewPaginated = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[];
};

export type MyLikeStatusTypes = 'Like' | 'Dislike' | 'None';


