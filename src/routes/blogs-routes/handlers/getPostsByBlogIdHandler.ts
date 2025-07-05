import {NextFunction, Request, Response} from "express";
import {PostsViewPaginated, PostInputQuery} from "../../../models/postTypes";
import {postsQueryRepository} from "../../posts-route/repositories/posts-query-repository";
import {blogsService} from "../blog-service";
import {paginationQueryPost} from "../../../pagination/post-pagination";

export const getPostsByBlogIdHandler = async (req: Request<{blogId:string},{},{},PostInputQuery>, res: Response<PostsViewPaginated>, next:NextFunction) => {
    try {
        await blogsService.checkBlogExists(req.params.blogId);
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryPost(req);
        const postByBlogId = await postsQueryRepository.getPostsByBlogId(req.params.blogId,
            {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            }
        );

        res.status(200).send(postByBlogId)
    } catch(error){
        next(error);
    }
}