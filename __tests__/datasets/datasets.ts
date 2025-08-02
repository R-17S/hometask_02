import {BlogDbTypes} from "../../src/db/blog-type";
import {PostDbTypes} from "../../src/db/post-type";
import {admin_Password, admin_Username} from "../../src/middlewares/autorization-middleware";
import {ObjectId, WithId} from "mongodb";
import {UserDbTypes} from "../../src/db/user-type";
import {CommentDbTypes} from "../../src/db/comment-type";


const authString = `${admin_Username}:${admin_Password}`;
export const authToken = Buffer.from(authString).toString('base64');



export const createString = (length: number) => {
    let string = "";
    for (let i = 0; i < length; i++) {
        string += i % 10
    }
    return string
}

export const blog1: WithId<BlogDbTypes> = {
    _id: new ObjectId(),
    name: 'Blog 1',
    description: 'Description 1',
    websiteUrl: 'https://blog1.com',
    createdAt: new Date(),
    isMembership: false
} as const

export const blog2: WithId<BlogDbTypes> = {
    _id: new ObjectId(),
    name: 'Blog 2',
    description: 'Description 2',
    websiteUrl: 'https://blog2.com',
    createdAt: new Date(),
    isMembership: false
} as const

export const post1: WithId<PostDbTypes> = {
    _id: new ObjectId(),
    title: 'Post 1',
    shortDescription: 'Short 1',
    content: 'Content 1',
    blogId: blog1._id.toString(),
    blogName: 'Blog 1',
    createdAt: new Date()
} as const

export const post2: WithId<PostDbTypes> = {
    _id: new ObjectId(),
    title: 'Post 2',
    shortDescription: 'Short 2',
    content: 'Content 2',
    blogId: blog1._id.toString(),
    blogName: 'Blog 1',
    createdAt: new Date()
} as const;

export const post3: WithId<PostDbTypes> = {
    _id: new ObjectId(),
    title: 'Post 3',
    shortDescription: 'Short 3',
    content: 'Content 3',
    blogId: blog2._id.toString(),
    blogName: 'Blog 2',
    createdAt: new Date()
} as const;

export const post4: WithId<PostDbTypes> = {
    _id: new ObjectId(),
    title: 'Post 4',
    shortDescription: 'Short 4',
    content: 'Content 4',
    blogId: blog2._id.toString(),
    blogName: 'Blog 2',
    createdAt: new Date()
} as const;

export const user1: WithId<UserDbTypes>= {
    _id: new ObjectId(),
    login: 'user1',
    email: 'user1@example.com',
    passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMy...',
    createdAt: new Date()
} as const;

export const user2: WithId<UserDbTypes> = {
    _id: new ObjectId(),
    login: 'user2',
    email: 'user2@example.com',
    passwordHash: '$2a$10$2ZMRZoMyN9qo8uLOickgx...',
    createdAt: new Date()
} as const;

export const user3: WithId<UserDbTypes> = {
    _id: new ObjectId(),
    login: 'user3',
    email: 'user3@example.com',
    passwordHash: '$2a$10$8uLOickgx2ZMRZoMyN9qo...',
    createdAt: new Date()
} as const;

export const user4: WithId<UserDbTypes> = {
    _id: new ObjectId(),
    login: 'user4',
    email: 'user4@example.com',
    passwordHash: '$2a$10$ZoMyN9qo8uLOickgx2ZMR...',
    createdAt: new Date()
} as const;

export const comment1: WithId<CommentDbTypes> = {
    _id: new ObjectId(),
    content: 'This is first comment content for post 1',
    commentatorInfo: {
        userId: user1._id.toString(),
        userLogin: user1.login
    },
    postId: post1._id.toString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) // 3 дня назад
} as const;

export const comment2: WithId<CommentDbTypes> = {
    _id: new ObjectId(),
    content: 'Another comment for post 1 with different author',
    commentatorInfo: {
        userId: user2._id.toString(),
        userLogin: user2.login
    },
    postId: post1._id.toString(),
    createdAt: new Date(new Date().setHours(new Date().getHours() - 2)) // 2 часа назад
} as const;

export const comment3: WithId<CommentDbTypes> = {
    _id: new ObjectId(),
    content: 'First comment for post 3 with maximum length comment. ' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    commentatorInfo: {
        userId: user3._id.toString(),
        userLogin: user3.login
    },
    postId: post3._id.toString(),
    createdAt: new Date()
} as const;

export const comment4: WithId<CommentDbTypes> = {
    _id: new ObjectId(),
    content: 'Old comment for post 2 from user4',
    commentatorInfo: {
        userId: user4._id.toString(),
        userLogin: user4.login
    },
    postId: post2._id.toString(),
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)) // 1 месяц назад
} as const;

export const dataset1 = {
    blogs: [blog1],
    posts: [],
    users: [],
    comments: []
} as const

export const dataset2 = {
    blogs: [blog1, blog2],
    posts: [post1],
    users: [],
    comments: []
} as const

export const dataset3 = {
    blogs: [blog1, blog2],
    posts: [post1, post2, post3, post4],
    users: [user1, user2, user3, user4],
    comments: []
} as const;

export const dataset4 = {
    blogs: [blog1, blog2],
    posts: [post1, post2, post3, post4],
    users: [user1, user2, user3, user4],
    comments: [comment1, comment2, comment3, comment4]
} as const;