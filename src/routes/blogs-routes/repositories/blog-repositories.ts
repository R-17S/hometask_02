import {BlogDbTypes} from "../../../db/blog-type";
import {BlogInputModel} from "../../../models/blogTypes";
import {blogsCollection} from "../../../db/mongoDB";
import {ObjectId} from "mongodb";
import { injectable } from 'inversify';


@injectable()
export class BlogsRepository {
    async createBlog(newBlog: BlogDbTypes): Promise<ObjectId> {
        const result = await blogsCollection.insertOne(newBlog);
        return result.insertedId
    }

    async updateBlog(id: string, input: BlogInputModel) {
        const updateBlog = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            {$set: {...input}}
        );
        return updateBlog.modifiedCount === 1;
    }

    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1
    }

    async blogExists(id: string): Promise<boolean> {
        const result = await blogsCollection.countDocuments({_id: new ObjectId(id)});
        return  result > 0;
    }

}