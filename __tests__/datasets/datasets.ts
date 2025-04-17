import {BlogDbTypes} from "../../src/db/blog-type";
import {PostDbTypes} from "../../src/db/post-type";
import {dbType} from "../../src/db/db";
import {admin_Password, admin_Username} from "../../src/middlewares/autorization-middleware";
import {ObjectId} from "mongodb";


const authString = `${admin_Username}:${admin_Password}`;
export const authToken = Buffer.from(authString).toString('base64');

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
    id: Date.now().toString().slice(-2),
    title: 'Post 1',
    shortDescription: 'Short 1',
    content: 'Content 1',
    blogId: blog1._id,
    blogName: 'Blog 1',
} as const

export const dataset1: dbType = {
    blogs: [blog1],
    posts: []
} as const

export const dataset2: dbType = {
    blogs: [blog1, blog2],
    posts: [post1]
} as const