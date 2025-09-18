import { Container } from 'inversify';
import {BlogsRepository} from "./routes/blogs-routes/repositories/blog-repositories";
import {BlogsService} from "./routes/blogs-routes/blog-service";
import {BlogsController} from "./routes/blogs-routes/handlers/blogs-controller";
import {BlogsQueryRepository} from "./routes/blogs-routes/repositories/blog-query-repository";
import {PostsRepository} from "./routes/posts-route/repositories/post-repositories";
import {PostsQueryRepository} from "./routes/posts-route/repositories/posts-query-repository";
import {PostsService} from "./routes/posts-route/post-service";
import {PostsController} from "./routes/posts-route/handlers/posts-controller";
import {CommentQueryRepository} from "./routes/comments-routes/repositories/comment-query-repository";
import {CommentsRepository} from "./routes/comments-routes/repositories/comment-repository";
import {CommentsService} from "./routes/comments-routes/comments-service";
import {CommentsController} from "./routes/comments-routes/handlers/comments-controller";
import {SessionsQueryRepository} from "./routes/securityDevices-routes/repositories/session-query-repositories";
import {UsersController} from "./routes/users-routes/handlers/users-controller";
import {UsersQueryRepository} from "./routes/users-routes/repositories/user-query-repository";
import {UsersRepository} from "./routes/users-routes/repositories/user-repositories";
import {UsersService} from "./routes/users-routes/user-service";


const container = new Container();
//контейнер для блогов
container.bind<BlogsRepository>(BlogsRepository).toSelf();
container.bind<BlogsQueryRepository>(BlogsQueryRepository).toSelf();
container.bind<BlogsService>(BlogsService).toSelf();
container.bind<BlogsController>(BlogsController).toSelf();

//контейнер для постов
container.bind<PostsRepository>(PostsRepository).toSelf();
container.bind<PostsQueryRepository>(PostsQueryRepository).toSelf();
container.bind<PostsService>(PostsService).toSelf();
container.bind<PostsController>(PostsController).toSelf();

//контейнер для комментов
container.bind<CommentsRepository>(CommentsRepository).toSelf();
container.bind<CommentQueryRepository>(CommentQueryRepository).toSelf();
container.bind<CommentsService>(CommentsService).toSelf();
container.bind<CommentsController>(CommentsController).toSelf();

//контейнер для сессий
container.bind<SessionsQueryRepository>(SessionsQueryRepository).toSelf();

//контейнер для юзеров
container.bind<UsersRepository>(UsersRepository).toSelf();
container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf();
container.bind<UsersService>(UsersService).toSelf();
container.bind<UsersController>(UsersController).toSelf();

export { container };