import {inject, injectable} from "inversify";
import {CommentLikeRepository} from "./repositories/comment-like-repository";
import {LikeStatusTypes} from "../../db/commentLikeDb-type";


@injectable()
export class CommentsLikeService {
    constructor(@inject(CommentLikeRepository) private commentLikeRepository: CommentLikeRepository) {}

    async updateStatus(userId: string, commentId: string, status: LikeStatusTypes): Promise<void> {
        const currentState = await this.commentLikeRepository.find(userId, commentId);
        if (currentState?.status === status) return;
        await this.commentLikeRepository.save(userId, commentId, status);
    }

    async getMyStatus(userId: string, commentId: string): Promise<'Like' | 'Dislike' | 'None'> {
        const state = await this.commentLikeRepository.find(userId, commentId);
        return state?.status ??'None'
    }

    async getLikesCount(commentId: string): Promise<{likesCount: number, dislikesCount: number}> {
        const likesCount = await this.commentLikeRepository.count(commentId, 'Like');
        const dislikesCount = await this.commentLikeRepository.count(commentId, 'Dislike');
        return {likesCount, dislikesCount}
    }
}