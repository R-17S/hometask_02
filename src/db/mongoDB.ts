import {Collection, MongoClient} from "mongodb";
import {BlogDbTypes} from "./blog-type";
import {PostDbTypes} from "./post-type";
import {UserDbTypes} from "./user-type";
import dotenv from 'dotenv';
import {SETTINGS} from "../settings";
import {CommentDbTypes} from "./comment-type";
import {TokenDbTypes} from "./token-type";
import {ensureTTLIndex} from "../routes/auth-routes/application/ensureTTLIndex";
import {SessionDbType} from "./session-type";
import {RequestLogType} from "../models/requestType";


dotenv.config();


export let blogsCollection: Collection<BlogDbTypes>
export let postsCollection: Collection<PostDbTypes>
export let usersCollection: Collection<UserDbTypes>
export let commentsCollection: Collection<CommentDbTypes>
export let tokenCollection: Collection<TokenDbTypes>
export let sessionsCollection: Collection<SessionDbType>;
export let requestLogsCollection: Collection<RequestLogType>;

export async function runDb(mongoURI: string): Promise<boolean> {
    let client = new MongoClient(SETTINGS.MONGO_URL || mongoURI);
    let db = client.db(SETTINGS.DB.NAME);
    blogsCollection = db.collection<BlogDbTypes>(SETTINGS.DB.COLLECTION.BLOGS);
    postsCollection = db.collection<PostDbTypes>(SETTINGS.DB.COLLECTION.POSTS);
    usersCollection = db.collection<UserDbTypes>(SETTINGS.DB.COLLECTION.USERS);
    commentsCollection = db.collection<CommentDbTypes>(SETTINGS.DB.COLLECTION.COMMENTS);
    sessionsCollection = db.collection<SessionDbType>(SETTINGS.DB.COLLECTION.SESSION);
    requestLogsCollection = db.collection<RequestLogType>(SETTINGS.DB.COLLECTION.REQUESTLOGS)
    try {
        await client.connect()
        await client.db().command({ ping: 1 })
        await ensureTTLIndex({ requestLogsCollection, sessionsCollection });
        console.log('Successfully connected to MongoDB server')
        return true;
    } catch (error) {
        console.log('Connection to MongoDB failed', error)
        await client.close()
        return false;
    }
}


