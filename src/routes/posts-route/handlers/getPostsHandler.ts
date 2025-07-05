import {NextFunction, Request, Response} from "express";
import {PostsViewPaginated, PostInputQuery} from "../../../models/postTypes";
import {postsQueryRepository} from "../repositories/posts-query-repository";
import {paginationQueryPost} from "../../../pagination/post-pagination";

export const getPostsHandler = async (req:  Request<{},{},{},PostInputQuery>, res: Response<PostsViewPaginated>, next:NextFunction) => {
    try {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryPost(req);
        const posts = await postsQueryRepository.getAllPosts({
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        });
        res.status(200).send(posts);
    } catch(error){
        next(error);
    }
};