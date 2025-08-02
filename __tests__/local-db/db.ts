import {BlogDbTypes} from "../../src/db/blog-type";
import {PostDbTypes} from "../../src/db/post-type";
import {UserDbTypes} from "../../src/db/user-type";
import {CommentDbTypes} from "../../src/db/comment-type";

export type dbType = {
    blogs: BlogDbTypes[],
    posts: PostDbTypes[],
    users: UserDbTypes[],
    comments: CommentDbTypes[],
}

export type ReadonlyDbType = {
    blogs: Readonly<BlogDbTypes[]>,
    posts: Readonly<PostDbTypes[]>,
    users: Readonly<UserDbTypes[]>,
    comments: Readonly<CommentDbTypes[]>,
}

export const db: dbType = {
    blogs: [],
    posts: [],
    users: [],
    comments: []
}


export const setDB = (dataset?: Partial<ReadonlyDbType> ) => {
    if (!dataset) {
        db.blogs = []
        db.posts = []
        db.users = []
        db.comments = []
        return
    }
    db.blogs = dataset.blogs?.map(blog => ({...blog})) || db.blogs
    db.posts = dataset.posts?.map(post => ({...post})) || db.posts
    db.users = dataset.users?.map(user => ({...user})) || db.users
    db.comments = dataset.comments?.map(comment => ({...comment})) || db.comments
}
