import { PostInputModel} from "../../../models/postTypes";
import {postsCollection} from "../../../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDbTypes} from "../../../db/post-type";
import {injectable} from "inversify";



@injectable()
export class PostsRepository {
    async createPost(newPost: PostDbTypes): Promise<ObjectId> {
        const result = await postsCollection.insertOne(newPost);
        return result.insertedId
    }

    async updatePost(id: string, input: PostInputModel) {
        const updatePost = await postsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {...input}}
        );
        return updatePost.modifiedCount === 1;
    }

    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async postExists(postId: string): Promise<boolean> {
        const result = await postsCollection.countDocuments({_id: new ObjectId(postId)});
        return  result > 0;
    }
}