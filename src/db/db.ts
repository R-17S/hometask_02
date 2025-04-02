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

// export const db: dbType = {
//     blogs: [
//         { id: '1', name: 'Blog 1', description: 'Description 1', websiteUrl: 'https://blog1.com' },
//         { id: '2', name: 'Blog 2', description: 'Description 2', websiteUrl: 'https://blog2.com' }
//     ],
//     posts: [
//         { id: '1', title: 'Post 1', shortDescription: 'Short 1', content: 'Content 1', blogId: '1', blogName: 'Blog 1' },
//         { id: '2', title: 'Post 2', shortDescription: 'Short 2', content: 'Content 2', blogId: '2', blogName: 'Blog 2' }
//     ]
// };

export const setDB = (dataset?: Partial<ReadonlyDbType> ) => {
    if (!dataset) {
        db.blogs = []
        db.posts = []
        return
    }
    db.blogs = dataset.blogs?.map(blog => ({...blog})) || db.blogs
    db.posts = dataset.posts?.map(post => ({...post})) || db.posts
}
