
import {Router, Request, Response} from "express";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../../db/mongoDB";


export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    // setDB()
    await  Promise.all([
        blogsCollection.deleteMany({}),
        postsCollection.deleteMany({}),
        usersCollection.deleteMany({}),
        commentsCollection.deleteMany({}),
    ])
    res.status(204).end()
});