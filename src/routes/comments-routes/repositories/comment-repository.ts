import {ObjectId} from "mongodb";
import {CommentModel} from "../../../db/comment-type";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository  {
    async save(comment: InstanceType<typeof CommentModel>): Promise<void> {
        await comment.save();
    }

    async findById(id: string): Promise<InstanceType<typeof CommentModel> | null> {
        return CommentModel.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    async exists(id: string): Promise<boolean> {
        return !!(await CommentModel.exists({ _id: new ObjectId(id) }));
    }
}
