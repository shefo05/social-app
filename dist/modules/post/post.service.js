"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const user_friend_repository_1 = require("../../DB/models/user-friend/user-friend.repository");
class PostSevice {
    _postRepo;
    _commentRepo;
    _userFriendRepo;
    constructor(_postRepo, _commentRepo, _userFriendRepo) {
        this._postRepo = _postRepo;
        this._commentRepo = _commentRepo;
        this._userFriendRepo = _userFriendRepo;
    }
    async getPostsByUsers(userIds, query) {
        const skip = (query.page - 1) * query.limit;
        const posts = await this._postRepo.getAll({
            userId: { $in: userIds },
        }, {}, {
            sort: { createdAt: -1 },
            skip,
            limit: query.limit + 1,
        });
        const hasNext = posts.length > query.limit;
        const data = hasNext ? posts.slice(0, query.limit) : posts;
        return {
            data,
            page: query.page,
            limit: query.limit,
            hasNext,
        };
    }
    async create(createPostDTO, userId) {
        return await this._postRepo.create({ ...createPostDTO, userId });
    }
    async getOne(id) {
        return await this._postRepo.getOne({ _id: id }, {}, { populate: { path: "userId" } });
    }
    async update(id, userId, updatePostDTO) {
        const postUpdated = await this._postRepo.updateOne({ _id: id, userId }, updatePostDTO);
        if (!postUpdated)
            throw new common_1.UnauthorizedException("you are not authorized to update this post");
        return postUpdated;
    }
    async delete(id, userId) {
        {
            const postExist = await this._postRepo.getOne({ _id: id });
            if (!postExist)
                throw new common_1.NotFoundException("post not found");
            await this._commentRepo.deleteMany({ postId: id });
            const { deletedCount } = await this._postRepo.deleteOne({
                _id: id,
                userId,
            });
            return deletedCount;
        }
    }
    async getFeed(userId, query) {
        const relations = await this._userFriendRepo.getAll({
            $or: [{ user: userId }, { friend: userId }],
        });
        const feedUserIdStrings = new Set([userId.toString()]);
        for (const relation of relations) {
            if (relation.user.equals(userId)) {
                feedUserIdStrings.add(relation.friend.toString());
            }
            else {
                feedUserIdStrings.add(relation.user.toString());
            }
        }
        const feedUserIds = [...feedUserIdStrings].map((id) => new mongoose_1.Types.ObjectId(id));
        return this.getPostsByUsers(feedUserIds, query);
    }
    async getMyPosts(userId, query) {
        return this.getPostsByUsers([userId], query);
    }
}
exports.default = new PostSevice(post_repository_1.postRepo, comment_repository_1.commentRepo, user_friend_repository_1.userFriendRepo);
