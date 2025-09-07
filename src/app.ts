import express, {NextFunction, Request, Response} from "express";
import cors from "cors"
import {SETTINGS} from "./settings";
import {blogsRouter} from "./routes/blogs-routes";
import {postsRouter} from "./routes/posts-route";
import {testingRouter} from "./routes/testing/app";
import {usersRouter} from "./routes/users-routes";
import {authRouter} from "./routes/auth-routes";
import {commentsRoutes} from "./routes/comments-routes";
import {HttpException} from "./helper/exceptions";
import cookieParser from "cookie-parser";
import {securityDevicesRoutes} from "./routes/securityDevices-routes";



export const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Роут для главной страницы
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello World');
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRoutes)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.SECURITYDEVICES, securityDevicesRoutes)
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpException) {
        res.status(error.status).send(error.message)
        return
    }

    console.error('Internal Server Error', error);
    res.sendStatus(500)
    return
});



