import {BlogDbTypes} from "../../db/blog-type";
import {BlogInputModel, BlogViewModel} from "../../models/blogTypes";
import {ObjectId} from "mongodb";
import {blogsRepository} from "./repositories/blog-repositories";



export const blogsService = {
    async createBlog(input: BlogInputModel): Promise<ObjectId> {
        const newBlog = {
            _id: new ObjectId(),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        return await blogsRepository.createBlog(newBlog);
    },

    async updateBlog(id: string, input: BlogInputModel) {
        return await blogsRepository.updateBlog(id, input);
    },

    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id);
    },

    mapToBlogViewModel(input: BlogDbTypes): BlogViewModel {
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