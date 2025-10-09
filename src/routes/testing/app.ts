
import {Router, Request, Response} from "express";
import {BlogModel} from "../../db/blog-type";
import {PostModel} from "../../db/post-type";
import {UserModel} from "../../db/user-type";
import {CommentModel} from "../../db/comment-type";


export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    // setDB()
    await  Promise.all([
        BlogModel.deleteMany({}),
        PostModel.deleteMany({}),
        UserModel.deleteMany({}),
        CommentModel.deleteMany({}),
    ])
    res.status(204).end()
});