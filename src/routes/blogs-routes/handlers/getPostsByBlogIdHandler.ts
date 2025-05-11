import {Request, Response} from "express";
import {PaginatedViewPosts, PostQueryParams} from "../../../models/postTypes";
import {postQueryRepository} from "../../posts-route/repositories/post-query-repository";

export const getPostsByBlogIdHandler = async (req: Request<{id:string},{},{},PostQueryParams>, res: Response<PaginatedViewPosts>) => {
    const postByBlogId = await postQueryRepository.getPostsByBlogId(req.params.id,
        {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
        }
    );

    if (!postByBlogId) {
        res.sendStatus(404);
        return
    }

    res.status(200).send(postByBlogId)
}