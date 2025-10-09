import { PostInputModel} from "../../../models/postTypes";
import {ObjectId} from "mongodb";
import {PostDbTypes, PostModel} from "../../../db/post-type";
import {injectable} from "inversify";



@injectable()
export class PostsRepository {
    async createPost(newPost: PostDbTypes): Promise<string> {
        const result = await PostModel.create(newPost);
        return result._id.toString();
    }

    async updatePost(id: string, input: PostInputModel): Promise<boolean> {
        const updatePost = await PostModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: {...input}}
        );
        return updatePost.modifiedCount === 1;
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async postExists(postId: string): Promise<boolean> {
        const result = await PostModel.exists({_id: new ObjectId(postId)});
        return  !!result;
    }
}