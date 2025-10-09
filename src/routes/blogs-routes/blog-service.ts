import {BlogDbTypes} from "../../db/blog-type";
import {BlogInputModel, BlogViewModel} from "../../models/blogTypes";
import {WithId} from "mongodb";
import {BlogsRepository} from "./repositories/blog-repositories";
import {NotFoundException} from "../../helper/exceptions";
import {injectable, inject} from "inversify";


@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

    async createBlog(input: BlogInputModel): Promise<string> {
        const newBlog = {
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        return await this.blogsRepository.createBlog(newBlog);
    }

    async updateBlog(id: string, input: BlogInputModel) {
        return await this.blogsRepository.updateBlog(id, input);
    }

    async deleteBlog(id: string) {
        return await this.blogsRepository.deleteBlog(id);
    }

    async checkBlogExists(blogId: string): Promise<void> {
        const exists =  await this.blogsRepository.blogExists(blogId);
        if (!exists) throw new NotFoundException('Blog not found');
    }

    mapToBlogViewModel(input: WithId<BlogDbTypes>): BlogViewModel {
        return {
            id: input._id.toString(),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: input.createdAt,
            isMembership: input.isMembership
        };
    }
}