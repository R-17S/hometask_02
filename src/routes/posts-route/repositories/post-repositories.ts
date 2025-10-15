import {ObjectId} from "mongodb";
import {PostModel} from "../../../db/post-type";
import {injectable} from "inversify";




@injectable()
export class PostsRepository {
    async save(post: InstanceType<typeof PostModel>): Promise<void> {
        await post.save();
    }

    // InstanceType это тип такого экземпляра, нельзя тут всунуть простой тип (Это plain object — просто описание полей, без поведения, без методов,)
    async findById(id: string): Promise<InstanceType<typeof PostModel> | null>  {
        return PostModel.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async exists(id: string): Promise<boolean> {
        return !!(await PostModel.exists({_id: new ObjectId(id)}));
    }
}