import {BlogDbTypes} from "../../db/blog-type";
import {db} from "../../db/db";
import {BlogInputModel} from "../../models/blogTypes";


export const blogsRepository = {
    getAllBlogs(): BlogDbTypes[] {
        return db.blogs
    },

    getBlogById(id: string)  {
        return db.blogs.find((blog) => blog.id === id);
    },

    createBlog(input: BlogInputModel) {
        const newBlog = {
            id: Date.now().toString().slice(-2),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
        }
        db.blogs.push(newBlog);
        return newBlog
    },

    updateBlog(id: string, input: BlogInputModel) {
        const foundBlog = db.blogs.find((blog) => blog.id === id);
        if (!foundBlog) return false;

        foundBlog.name = input.name;
        foundBlog.description = input.description;
        foundBlog.websiteUrl = input.websiteUrl;

        return true;
    },

    deleteBlog(id: string) {
        const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
        if (blogIndex === -1) return false;
        db.blogs.splice(blogIndex, 1);
        return true;
    }
};