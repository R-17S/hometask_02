import {PostLikeModel} from "../../src/db/postLikeDb-type";

describe('PostLikeModel statics', () => {
    beforeEach(async () => {
        await PostLikeModel.deleteMany({});
    });

    it('should create new like', async () => {
        await PostLikeModel.updateStatus('user1', 'post1', 'Like');
        const like = await PostLikeModel.findOne({ userId: 'user1', postId: 'post1' });
        expect(like).not.toBeNull();
        expect(like?.status).toBe('Like');
    });

    it('should update existing like', async () => {
        await PostLikeModel.updateStatus('user1', 'post1', 'Like');
        await PostLikeModel.updateStatus('user1', 'post1', 'Dislike');
        const like = await PostLikeModel.findOne({ userId: 'user1', postId: 'post1' });
        expect(like?.status).toBe('Dislike');
    });

    it('should delete like on status None', async () => {
        await PostLikeModel.updateStatus('user1', 'post1', 'Like');
        await PostLikeModel.updateStatus('user1', 'post1', 'None');
        const like = await PostLikeModel.findOne({ userId: 'user1', postId: 'post1' });
        expect(like).toBeNull();
    });

    it('should return correct myStatus', async () => {
        expect(await PostLikeModel.getMyStatus('user1', 'post1')).toBe('None');
        await PostLikeModel.updateStatus('user1', 'post1', 'Like');
        expect(await PostLikeModel.getMyStatus('user1', 'post1')).toBe('Like');
    });

    it('should count likes and dislikes correctly', async () => {
        await PostLikeModel.updateStatus('user1', 'post1', 'Like');
        await PostLikeModel.updateStatus('user2', 'post1', 'Dislike');
        await PostLikeModel.updateStatus('user3', 'post1', 'Like');

        expect(await PostLikeModel.getLikesCount('post1')).toBe(2);
        expect(await PostLikeModel.getDislikesCount('post1')).toBe(1);
    });
});