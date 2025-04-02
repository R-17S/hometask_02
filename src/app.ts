import express, {Request, Response} from "express";
import cors from "cors"
import {SETTINGS} from "./settings";
import {blogsRouter} from "./routes/blogs-routes/app";
import {postsRouter} from "./routes/posts-route";
import {testingRouter} from "./routes/testing/app";



export const app = express();
app.use(express.json())
app.use(cors())

// Роут для главной страницы
app.get('/', (req: Request, res: Response) => {
    res.send('No Mercy');
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)