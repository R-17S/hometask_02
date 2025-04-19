import {PostInputModel, PostViewModel} from "../../models/postTypes";
import {blogsRepository} from "../blogs-routes/blog-repositories";
import {postsCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDbTypes} from "../../db/post-type";


export const postsRepositories = {
    async getAllPosts(): Promise<PostViewModel[]> {
        const result = await postsCollection.find().toArray();
        return result.map(this.mapToPostViewModel);
    },

    async getPostById(id: string): Promise<PostViewModel | null > {
        const result = await postsCollection.findOne({_id: new ObjectId(id)});
        if (!result) return null;
        return this.mapToPostViewModel(result);
    },

    async createPost(input: PostInputModel): Promise<ObjectId | undefined> {
        const blog = await blogsRepository.getBlogById(input.blogId)
        if (!blog) return undefined

        const newPost = {
            _id: new ObjectId(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blog.name,
            createdAt: new Date(),
        };

        const result = await postsCollection.insertOne(newPost)
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


    mapToPostViewModel(input: PostDbTypes): PostViewModel {
        return {
            id: input._id.toString(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: input.blogName,
            createdAt: input.createdAt
        }
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