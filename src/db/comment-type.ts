


export type CommentDbTypes = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    createdAt: Date;
};