import {setDB} from "../../db/db";
import {Router, Request, Response} from "express";


export const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    setDB()
    res.status(204).end()
});