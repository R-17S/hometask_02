import {BlogDbTypes} from "./blog-type";
import {PostDbTypes} from "./post-type";
import {UserDbTypes} from "./user-type";

export type dbType = {
    blogs: BlogDbTypes[],
    posts: PostDbTypes[],
    users: UserDbTypes[],
}

export type ReadonlyDbType = {
    blogs: Readonly<BlogDbTypes[]>,
    posts: Readonly<PostDbTypes[]>,
    users: Readonly<UserDbTypes[]>,
}

export const db: dbType = {
    blogs: [],
    posts: [],
    users: []
}


export const setDB = (dataset?: Partial<ReadonlyDbType> ) => {
    if (!dataset) {
        db.blogs = []
        db.posts = []
        db.users = []
        return
    }
    db.blogs = dataset.blogs?.map(blog => ({...blog})) || db.blogs
    db.posts = dataset.posts?.map(post => ({...post})) || db.posts
    db.users = dataset.users?.map(user => ({...user})) || db.users
}
