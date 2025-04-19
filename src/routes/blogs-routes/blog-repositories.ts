import {BlogDbTypes} from "../../db/blog-type";
import {BlogInputModel, BlogViewModel} from "../../models/blogTypes";
import {blogsCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";



export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        const result = await blogsCollection.find().toArray();
        return  result.map(this.mapToBlogViewModel);
    },

    async getBlogById(id: string): Promise<BlogViewModel | null>  {
        const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if (!result) return null;
        return  this.mapToBlogViewModel(result)
    },

    async createBlog(input: BlogInputModel): Promise<ObjectId> {
        const newBlog = {
            _id: new ObjectId(),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        const result = await blogsCollection.insertOne(newBlog);
        return result.insertedId
    },

    async updateBlog(id: string, input: BlogInputModel) {
        const updateBlog = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            {$set: {...input}}
        );
        return updateBlog.modifiedCount === 1;
    },

    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1
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