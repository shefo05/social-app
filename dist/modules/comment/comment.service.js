"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
class CommentService {
    _postRepo;
    _commentRepo;
    constructor(_postRepo, _commentRepo) {
        this._postRepo = _postRepo;
        this._commentRepo = _commentRepo;
    }
    async create(createCommentDTO, params, userId) {
        if (params.postId) {
            const postExist = await this._postRepo.getOne({ _id: params.postId });
            if (!postExist)
                throw new common_1.NotFoundException("post not available");
        }
        // const postExist = await this._postRepo.getOne({ _id: params.postId });
        // if (!postExist) throw new NotFoundException("post not available");
        let parentCommentExist = undefined;
        if (params.parentId) {
            parentCommentExist = await this._commentRepo.getOne({
                _id: params.parentId,
            });
            if (!parentCommentExist)
                throw new common_1.NotFoundException("comment not available");
        }
        let postId = params.postId || parentCommentExist?.postId;
        const createdComment = await this._commentRepo.create({
            ...createCommentDTO,
            ...params,
            userId,
            postId,
        });
        this._postRepo.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });
        return createdComment;
    }
    // async addReaction(addReactionDTO:AddR)
    async getAll(params) {
        const comments = await this._commentRepo.getAll({
            postId: params.postId,
            parentId: params.parentId,
        });
        if (comments.length == 0)
            throw new common_1.NotFoundException("no comments exist");
        return comments;
    }
    async update(id, userId, updateCommentDTO) {
        const commentExist = await this._commentRepo.getOne({ _id: id }, {}, { populate: [{ path: "postId" }] });
        if (!commentExist)
            throw new common_1.NotFoundException("comment is not available");
        const commentAuthor = commentExist.userId.toString();
        if (userId.toString() != commentAuthor) {
            throw new common_1.UnauthorizedException("you are not authorized to update this comment");
        }
        return await this._commentRepo.updateOne({ _id: id }, updateCommentDTO);
    }
    async delete(id, userId) {
        const commentExist = await this._commentRepo.getOne({ _id: id }, {}, { populate: [{ path: "postId" }] });
        if (!commentExist)
            throw new common_1.NotFoundException("comment is not available");
        const commentAuthor = commentExist.userId.toString();
        const postAuthor = commentExist.postId[0]?.userId.toString();
        // const postExist = await this._postRepo.getOne({ _id: commentExist.postId });
        // const postAuthor = postExist?.userId;
        if (userId.toString() != commentAuthor && userId.toString() != postAuthor) {
            throw new common_1.UnauthorizedException("you are not authorized to delete this comment");
        }
        await this._commentRepo.deleteOne({ _id: id });
    }
}
exports.CommentService = CommentService;
exports.default = new CommentService(post_repository_1.postRepo, comment_repository_1.commentRepo);
