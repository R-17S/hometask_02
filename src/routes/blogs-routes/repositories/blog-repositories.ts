import {BlogModel} from "../../../db/blog-type";
import { injectable } from 'inversify';
import {ObjectId} from "mongodb";
import {NotFoundException} from "../../../helper/exceptions";


@injectable()
export class BlogsRepository {
    async save(blog: InstanceType<typeof BlogModel>): Promise<void> {
        await blog.save();
    }
    // InstanceType это тип такого экземпляра, нельзя тут всунуть простой тип (Это plain object — просто описание полей, без поведения, без методов,)
    async findById(id: string): Promise<InstanceType<typeof BlogModel> | null> {
        return BlogModel.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    async exists(id: string): Promise<boolean> {
        return !!(await BlogModel.exists({ _id: new ObjectId(id) }));
    }

    async getBlogNameOrError(id: string): Promise<string> {
        const blog = await BlogModel.findById(id).lean();
        if (!blog) throw new NotFoundException('Blog not found');
        return blog.name;
    }
}