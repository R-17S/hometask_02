import {Request, Response} from 'express';
import {PostByBlogIdInputModel, PostViewModel} from "../../../models/postTypes";
import {postsService} from "../../posts-route/post-service";
import {postQueryRepository} from "../../posts-route/repositories/post-query-repository";

export const createPostByBlogIdHandler = async (req: Request<{id:string},{},PostByBlogIdInputModel>, res: Response<PostViewModel | null>) => {
    const newPost = await postsService.createPost(req.body, req.params.id);
    if (!newPost) return undefined
    const newPostId = await postQueryRepository.getPostById(newPost.toString());
    // if (!newPost) return res.sendStatus(400);
    res.status(201).json(newPostId);
}