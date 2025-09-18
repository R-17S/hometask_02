// import {NextFunction, Request, Response} from "express";
// import {PostsViewPaginated, PostInputQuery} from "../../../models/postTypes";
// import {postsQueryRepository} from "../../posts-route/repositories/posts-query-repository";
// import {BlogsService} from "../blog-service";
// import {paginationQueryPost} from "../../../pagination/post-pagination";
// import {inject, injectable} from "inversify/lib/esm";
// import {BlogsQueryRepository} from "../repositories/blog-query-repository";


// @injectable()
// export class BlogsController {
//     constructor(
//         @inject(BlogsService) private blogsService: BlogsService,
//         @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository
//     ) {}
// //
//     async getPostsByBlogId(req: Request<{
//         blogId: string
//     }, {}, {}, PostInputQuery>, res: Response<PostsViewPaginated>, next: NextFunction) {
//         try {
//             await this.blogsService.checkBlogExists(req.params.blogId);
//             const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueryPost(req);
//             const postByBlogId = await this.postsQueryRepository.getPostsByBlogId(req.params.blogId,
//                 {
//                     pageNumber,
//                     pageSize,
//                     sortBy,
//                     sortDirection,
//                 }
//             // );
//
//             res.status(200).send(postByBlogId)
//         } catch (error) {
//             next(error);
//         }
//     }
// }