import {Request, Response} from "express";
import {PostsViewPaginated, PostInputQuery} from "../../../models/postTypes";
import {postsQueryRepository} from "../../posts-route/repositories/posts-query-repository";
import {blogsService} from "../blog-service";

export const getPostsByBlogIdHandler = async (req: Request<{blogId:string},{},{},PostInputQuery>, res: Response<PostsViewPaginated>) => {
    const  blogExists = await blogsService.checkBlogExists(req.params.blogId);
    if (!blogExists) {
        res.sendStatus(404);
        return;
    }

    const postByBlogId = await postsQueryRepository.getPostsByBlogId(req.params.blogId,
        {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: req.query.sortBy || 'createdAt',
            sortDirection: req.query.sortDirection === 'asc'? 'asc': 'desc',
        }
    );

    res.status(200).send(postByBlogId)
}