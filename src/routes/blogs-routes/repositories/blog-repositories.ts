import {BlogDbTypes, BlogModel} from "../../../db/blog-type";
import {BlogInputModel} from "../../../models/blogTypes";
import { injectable } from 'inversify';
import {ObjectId} from "mongodb";


@injectable()
export class BlogsRepository {
    async createBlog(newBlog: BlogDbTypes): Promise<string> {
        const result = await BlogModel.create(newBlog);
        return result._id.toString();
    }

    async updateBlog(id: string, input: BlogInputModel): Promise<boolean> {
        const updateBlog = await BlogModel.updateOne(
            { _id: new ObjectId(id) },
            {$set: input}
        );
        return updateBlog.modifiedCount === 1;
    }

    async deleteBlog(id: string) {
        const result = await BlogModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    }

    async blogExists(id: string): Promise<boolean> {
        const result = await BlogModel.exists({_id: new ObjectId(id)});
        return  !!result;
    }
}