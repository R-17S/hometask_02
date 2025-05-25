import {BlogDbTypes} from "../../src/db/blog-type";
import {PostDbTypes} from "../../src/db/post-type";
import {dbType} from "../../src/db/db";
import {admin_Password, admin_Username} from "../../src/middlewares/autorization-middleware";
import {ObjectId} from "mongodb";
import {UserDbTypes} from "../../src/db/user-type";



const authString = `${admin_Username}:${admin_Password}`;
export const authToken = Buffer.from(authString).toString('base64');

// const hashPasswordDataSet = async (plainPassword: string): Promise<string> => {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(plainPassword, salt);
// };
//
// (async () => {
//     console.log(await hashPasswordDataSet('password1'));
//     console.log(await hashPasswordDataSet('password2'));
//     console.log(await hashPasswordDataSet('password3'));
//     console.log(await hashPasswordDataSet('password4'));
// })();

export const createString = (length: number) => {
    let string = "";
    for (let i = 0; i < length; i++) {
        string += i % 10
    }
    return string
}

export const blog1: BlogDbTypes = {
    _id: new ObjectId(),
    name: 'Blog 1',
    description: 'Description 1',
    websiteUrl: 'https://blog1.com',
    createdAt: new Date(),
    isMembership: false
} as const

export const blog2: BlogDbTypes = {
    _id: new ObjectId(),
    name: 'Blog 2',
    description: 'Description 2',
    websiteUrl: 'https://blog2.com',
    createdAt: new Date(),
    isMembership: false
} as const

export const post1: PostDbTypes = {
    _id: new ObjectId(),
    title: 'Post 1',
    shortDescription: 'Short 1',
    content: 'Content 1',
    blogId: blog1._id.toString(),
    blogName: 'Blog 1',
    createdAt: new Date()
} as const

export const post2: PostDbTypes = {
    _id: new ObjectId(),
    title: 'Post 2',
    shortDescription: 'Short 2',
    content: 'Content 2',
    blogId: blog1._id.toString(),
    blogName: 'Blog 1',
    createdAt: new Date()
} as const;

export const post3: PostDbTypes = {
    _id: new ObjectId(),
    title: 'Post 3',
    shortDescription: 'Short 3',
    content: 'Content 3',
    blogId: blog2._id.toString(),
    blogName: 'Blog 2',
    createdAt: new Date()
} as const;

export const post4: PostDbTypes = {
    _id: new ObjectId(),
    title: 'Post 4',
    shortDescription: 'Short 4',
    content: 'Content 4',
    blogId: blog2._id.toString(),
    blogName: 'Blog 2',
    createdAt: new Date()
} as const;

export const user1: UserDbTypes = {
    _id: new ObjectId(),
    login: 'user1',
    email: 'user1@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy...',
    createdAt: new Date()
} as const;

export const user2: UserDbTypes = {
    _id: new ObjectId(),
    login: 'user2',
    email: 'user2@example.com',
    password: '$2a$10$2ZMRZoMyN9qo8uLOickgx...',
    createdAt: new Date()
} as const;

export const user3: UserDbTypes = {
    _id: new ObjectId(),
    login: 'user3',
    email: 'user3@example.com',
    password: '$2a$10$8uLOickgx2ZMRZoMyN9qo...',
    createdAt: new Date()
} as const;

export const user4: UserDbTypes = {
    _id: new ObjectId(),
    login: 'user4',
    email: 'user4@example.com',
    password: '$2a$10$ZoMyN9qo8uLOickgx2ZMR...',
    createdAt: new Date()
} as const;

export const dataset1: dbType = {
    blogs: [blog1],
    posts: [],
    users: []
} as const

export const dataset2: dbType = {
    blogs: [blog1, blog2],
    posts: [post1],
    users: []
} as const

export const dataset3: dbType = {
    blogs: [blog1, blog2],
    posts: [post1, post2, post3, post4],
    users: [user1, user2, user3, user4]
} as const;