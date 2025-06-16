import {Request, Response} from "express";
import {PostsViewPaginated, PostInputQuery} from "../../../models/postTypes";
import {postsQueryRepository} from "../repositories/posts-query-repository";

export const getPostsHandler = async (req:  Request<{},{},{},PostInputQuery>, res: Response<PostsViewPaginated>) => {
    const posts = await postsQueryRepository.getAllPosts({
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
    });
    res.status(200).send(posts);
};