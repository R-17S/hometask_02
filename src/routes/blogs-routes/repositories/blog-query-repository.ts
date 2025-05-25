import {BlogInputQuery, BlogViewModel, BlogsViewPaginated} from "../../../models/blogTypes";
import {BlogDbTypes} from "../../../db/blog-type";
import {blogsCollection} from "../../../db/mongoDB";
import {ObjectId} from "mongodb";

export const blogsQueryRepository = {
    async getAllBlogs(params: BlogInputQuery): Promise<BlogsViewPaginated> {
        const {
            searchNameTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc',
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

        return  {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(this.mapToBlogViewModel),
        };
    },

    async getBlogById(id: string): Promise<BlogViewModel | null>  {
        const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if (!result) return null;
        return this.mapToBlogViewModel(result);
    },

    mapToBlogViewModel(blog: BlogDbTypes): BlogViewModel {
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