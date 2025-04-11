import {BlogDbTypes} from "./blog-type";
import {PostDbTypes} from "./post-type";

export type dbType = {
    blogs: BlogDbTypes[],
    posts: PostDbTypes[]
}

export type ReadonlyDbType = {
    blogs: Readonly<BlogDbTypes[]>,
    posts: Readonly<PostDbTypes[]>
}

export const db: dbType = {
    blogs: [],
    posts: []
}


export const setDB = (dataset?: Partial<ReadonlyDbType> ) => {
    if (!dataset) {
        db.blogs = []
        db.posts = []
        return
    }
    db.blogs = dataset.blogs?.map(blog => ({...blog})) || db.blogs
    db.posts = dataset.posts?.map(post => ({...post})) || db.posts
}
