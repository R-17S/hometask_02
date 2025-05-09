import {Request, Response} from "express";
import {PaginatedViewPosts, PostQueryParams} from "../../../models/postTypes";
import {postQueryRepository} from "../repositories/post-query-repository";

export const getPostsHandler = async (req:  Request<{},{},{},PostQueryParams>, res: Response<PaginatedViewPosts>) => {
    const posts = await postQueryRepository.getAllPosts({
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
    });
    res.status(200).send(posts);
};