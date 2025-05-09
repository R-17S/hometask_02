import { PostInputModel} from "../../../models/postTypes";
import {postsCollection} from "../../../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDbTypes} from "../../../db/post-type";



export const postsRepository = {
    async createPost(newPost: PostDbTypes): Promise<ObjectId> {
        const result = await postsCollection.insertOne(newPost);
        return result.insertedId
    },

    async updatePost(id: string, input: PostInputModel) {
        const updatePost = await postsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {...input}}
        );
        return updatePost.modifiedCount === 1;
    },

    async deletePost(id: string) {
    const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
    return result.deletedCount === 1;
    },



    // updatePost2(id: string, input: PostInputModel) {
    //     const blog = blogsRepository.getBlogById(input.blogId)!;
    //     let updatedPost: PostDbTypes | undefined = undefined;
    //
    //     db.posts = db.posts.map(p => p.id === id
    //         ? (() => {
    //             updatedPost = {...p, ...input, blogName: blog.name}
    //             return updatedPost } )()
    //         : p);
    //
    //     return updatedPost
    // },
    // map2(input: PostDbTypes) {
    //     const postUpdate: PostViewModel = {
    //         id: input.id,
    //         title: input.title,
    //         shortDescription: input.shortDescription,
    //         content: input.content,
    //         blogId: input.blogId,
    //         blogName: input.blogName
    //     }
    //     return postUpdate;
    // },



};