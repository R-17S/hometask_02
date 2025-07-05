import {NextFunction, Request, Response} from 'express';
import {PostByBlogIdInputModel, PostViewModel} from "../../../models/postTypes";
import {postsService} from "../../posts-route/post-service";
import {postsQueryRepository} from "../../posts-route/repositories/posts-query-repository";

export const createPostByBlogIdHandler = async (req: Request<{blogId:string},{},PostByBlogIdInputModel>, res: Response<PostViewModel>, next:NextFunction) => {
    try {
        const newPost = await postsService.createPost(req.body, req.params.blogId);
        const newPostId = await postsQueryRepository.getPostByIdOrError(newPost.toString());
        res.status(201).json(newPostId);
    } catch (error) {
        next(error)
    }
};