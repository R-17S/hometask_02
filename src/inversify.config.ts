import { Container } from 'inversify';
import {BlogsRepository} from "./routes/blogs-routes/repositories/blog-repositories";
import {BlogsService} from "./routes/blogs-routes/blog-service";
import {BlogsController} from "./routes/blogs-routes/handlers/blogs-controller";
import {BlogsQueryRepository} from "./routes/blogs-routes/repositories/blog-query-repository";
import {PostsRepository} from "./routes/posts-route/repositories/post-repositories";
import {PostsQueryRepository} from "./routes/posts-route/repositories/posts-query-repository";
import {PostsService} from "./routes/posts-route/post-service";
import {PostsController} from "./routes/posts-route/handlers/posts-controller";
import {CommentsQueryRepository} from "./routes/comments-routes/repositories/comments-query-repository";
import {CommentsRepository} from "./routes/comments-routes/repositories/comment-repository";
import {CommentsService} from "./routes/comments-routes/comments-service";
import {CommentsController} from "./routes/comments-routes/handlers/comments-controller";
import {SessionsQueryRepository} from "./routes/securityDevices-routes/repositories/session-query-repositories";
import {UsersController} from "./routes/users-routes/handlers/users-controller";
import {UsersQueryRepository} from "./routes/users-routes/repositories/user-query-repository";
import {UsersRepository} from "./routes/users-routes/repositories/user-repositories";
import {UsersService} from "./routes/users-routes/user-service";
import {AuthService} from "./routes/auth-routes/auth-service";
import {AuthController} from "./routes/auth-routes/handlers/auth-controller";
import {NodemailerService} from "./routes/auth-routes/application/nodemailer-service";
import {JwtService} from "./routes/auth-routes/application/jwt-service";
import {BcryptService} from "./routes/auth-routes/application/bcrypt-service";
import {SessionsRepository} from "./routes/securityDevices-routes/repositories/session-repositories";
import {SecurityDeviceController} from "./routes/securityDevices-routes/handlers/securityDevice-controller";
import {CommentsLikeService} from "./routes/comments-routes/comments-like-service";
import {CommentLikeRepository} from "./routes/comments-routes/repositories/comment-like-repository";


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
container.bind<CommentsQueryRepository>(CommentsQueryRepository).toSelf();
container.bind<CommentsService>(CommentsService).toSelf();
container.bind<CommentsController>(CommentsController).toSelf();
container.bind<CommentsLikeService>(CommentsLikeService).toSelf();
container.bind<CommentLikeRepository>(CommentLikeRepository).toSelf();

//контейнер для сессий
container.bind<SessionsQueryRepository>(SessionsQueryRepository).toSelf();
container.bind<SessionsRepository>(SessionsRepository).toSelf();
container.bind<SecurityDeviceController>(SecurityDeviceController).toSelf();

//контейнер для юзеров
container.bind<UsersRepository>(UsersRepository).toSelf();
container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf();
container.bind<UsersService>(UsersService).toSelf();
container.bind<UsersController>(UsersController).toSelf();

//контейнер для auth
container.bind<AuthService>(AuthService).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<BcryptService>(BcryptService).toSelf();
container.bind<JwtService>(JwtService).toSelf();
container.bind<NodemailerService>(NodemailerService).toSelf();

export { container };