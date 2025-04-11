import {PostInputModel, PostViewModel} from "../../models/postTypes";
import {db} from "../../db/db";
import {PostDbTypes} from "../../db/post-type";
import {blogsRepository} from "../blogs-routes/blog-repositories";


export const postsRepositories = {
    getAllPosts(): PostDbTypes[] {
        return db.posts;
    },

    getPostById(id: string): PostDbTypes | undefined {
        return db.posts.find(post => post.id === id);
    },

    createPost(input: PostInputModel): PostDbTypes {
        const newPost: PostDbTypes  = {
            id: Date.now().toString().slice(-2),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blogsRepository.getBlogById(input.blogId)!.name
        };
        db.posts.push(newPost);
        return newPost;
    },

    updatePost(id: string, input: PostInputModel) {
        const blog = blogsRepository.getBlogById(input.blogId)!;
        const postIndex = db.posts.findIndex(post => post.id === id);
        db.posts[postIndex] = {
            ...db.posts[postIndex],
            ...input,
            blogName: blog.name
        };

        return this.getPostViewModel(db.posts[postIndex]);
    },


    getPostViewModel(input: PostDbTypes): PostViewModel {
        return {
            id: input.id,
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: input.blogName
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


    deletePost(id: string) {
        const postIndex = db.posts.findIndex(post => post.id === id);
        if (postIndex === -1) return false;
        db.posts.splice(postIndex, 1);
        return true;
    }
};