import {BlogDbTypes} from "../../db/blog-type";
import {BlogInputModel, BlogViewModel} from "../../models/blogTypes";
import {ObjectId, WithId} from "mongodb";
import {blogsRepository} from "./repositories/blog-repositories";
import {NotFoundException} from "../../helper/exceptions";
import {ResultObject} from "../../helper/resultClass";
import {Result} from "../../helper/resultTypes";




export const blogsService = {
    async createBlog(input: BlogInputModel): Promise<Result<ObjectId>> {
        const newBlog = {
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        const createdId = await blogsRepository.createBlog(newBlog);
        return ResultObject.Success(createdId);
    },

    async updateBlog(id: string, input: BlogInputModel) {
        return await blogsRepository.updateBlog(id, input);
    },


    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id);
    },

    async checkBlogExists(blogId: string): Promise<void> {
        const exists =  await blogsRepository.blogExists(blogId);
        if (!exists) throw new NotFoundException('Blog not found');
    },


    mapToBlogViewModel(input: WithId<BlogDbTypes>): BlogViewModel {
        return {
            id: input._id.toString(),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: input.createdAt,
            isMembership: input.isMembership
        };
    }
};