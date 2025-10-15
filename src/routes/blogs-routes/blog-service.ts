import {BlogModel} from "../../db/blog-type";
import {BlogInputModel} from "../../models/blogTypes";
import {BlogsRepository} from "./repositories/blog-repositories";
import {NotFoundException} from "../../helper/exceptions";
import {injectable, inject} from "inversify";
import {Error} from "mongoose";


@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

    async createBlog(input: BlogInputModel): Promise<string> {
        const blog = new BlogModel({
            ...input,
            createdAt: new Date(),
            isMembership: false
        });

        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
    // При создании нового экземпляра (new Model(...)), он сразу генерирует ObjectId на клиенте — через mongoose.Types.ObjectId()
    // Это происходит до вызова save(), потому что _id нужен для внутренней идентификации документа, даже если он ещё не сохранён
    // Не будет работать только если я использую lean() или create() напрямую BlogModel.create({ ... })

    async updateBlog(id: string, input: BlogInputModel): Promise<void> {
        const blog = await this.blogsRepository.findById(id);
        if (!blog) throw new Error('Blog not found');
        blog.name = input.name;
        blog.description = input.description;
        blog.websiteUrl = input.websiteUrl;

        await this.blogsRepository.save(blog);
    }

    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsRepository.delete(id);
    }

    async checkBlogExists(id: string): Promise<void> {
        const exists = await this.blogsRepository.exists(id);
        if (!exists) throw new NotFoundException('Blog not found');
    }
}