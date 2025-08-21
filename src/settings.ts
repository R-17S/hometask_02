import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        AUTH: '/auth',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key',
    DB: {
        NAME: process.env.DB_NAME || 'blog-platform',
        COLLECTION: {
            BLOGS: 'blogs',
            POSTS: 'posts',
            USERS: 'users',
            COMMENTS: 'comments',
            TOKEN: 'token',
        },
    }
}
