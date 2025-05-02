import {BlogDbTypes} from "../../db/blog-type";
import {BlogInputModel} from "../../models/blogTypes";
import {blogsCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";



export const blogsRepository = {
    async getAllBlogs(): Promise<BlogDbTypes[]> {
        return blogsCollection.find().toArray();
    },

    async getBlogById(id: string): Promise<BlogDbTypes | null>  {
        return blogsCollection.findOne({ _id: new ObjectId(id) });
    },

    async createBlog(newBlog: BlogDbTypes): Promise<ObjectId> {
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

};