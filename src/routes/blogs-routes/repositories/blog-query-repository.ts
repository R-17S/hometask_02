import {BlogViewModel, BlogsViewPaginated, BlogPaginationQueryResult} from "../../../models/blogTypes";
import {blogsCollection} from "../../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {BlogDbTypes} from "../../../db/blog-type";
import {Result} from "../../../helper/resultTypes";
import {ResultObject} from "../../../helper/resultClass";

export const blogsQueryRepository = {
    async getAllBlogs(params: BlogPaginationQueryResult): Promise<Result<BlogsViewPaginated>> {
        const {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = params;

        const filter = searchNameTerm
            ? {name: {$regex: searchNameTerm, $options: 'i'}}
            : {};

        const sortOptions: Record<string, 1 | -1> = {
            [sortBy]: sortDirection === 'asc'? 1: -1,
        };

        const skip = (pageNumber - 1) * pageSize;

        const [totalCount, blogs] = await Promise.all([
            blogsCollection.countDocuments(filter),
            blogsCollection
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(pageSize)
                .toArray()
        ]);

        return ResultObject.Success({
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(this.mapToBlogViewModel),
        });
    },

    async getBlogByIdOrError(id: string): Promise<Result<BlogViewModel | null>>  {
        const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if (!result) {
            return ResultObject.NotFound(
                'Blog not found',
                [{ field: 'id', message: 'Blog with this id does not exist' }]
            );

        }
        return ResultObject.Success(this.mapToBlogViewModel(result));

    },



    mapToBlogViewModel(blog: WithId<BlogDbTypes>): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
    }

};