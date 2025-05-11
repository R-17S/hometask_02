import {setDB} from "../../db/db";
import {Router, Request, Response} from "express";
import {blogsCollection, postsCollection} from "../../db/mongoDB";


export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    // setDB()
    await  Promise.all([
        postsCollection.deleteMany({}),
        blogsCollection.deleteMany({}),
    ])
    res.status(204).end()
});