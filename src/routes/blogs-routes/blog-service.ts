import {BlogDbTypes} from "../../db/blog-type";
import {BlogInputModel, BlogViewModel} from "../../models/blogTypes";
import {ObjectId} from "mongodb";
import {blogsRepository} from "./repositories/blog-repositories";
import {postsQueryRepository} from "../posts-route/repositories/posts-query-repository";
import {blogsQueryRepository} from "./repositories/blog-query-repository";



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

    async checkBlogExists(blogId: string): Promise<boolean> {
        return await blogsQueryRepository.blogExists(blogId);
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