import {Request, Response} from 'express';
import {PostByBlogIdInputModel, PostViewModel} from "../../../models/postTypes";
import {postsService} from "../../posts-route/post-service";
import {postsQueryRepository} from "../../posts-route/repositories/posts-query-repository";
import {blogsService} from "../blog-service";

export const createPostByBlogIdHandler = async (req: Request<{blogId:string},{},PostByBlogIdInputModel>, res: Response<PostViewModel | null>) => {
    const newPost = await postsService.createPost(req.body, req.params.blogId);
    if (!newPost) {
        res.sendStatus(404);
        return
    }
    const newPostId = await postsQueryRepository.getPostById(newPost.toString());
    // if (!newPost) return res.sendStatus(400);
    res.status(201).json(newPostId);
}