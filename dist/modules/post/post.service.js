"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/models/post/post.repository");
class PostSevice {
    _postRepo;
    constructor(_postRepo) {
        this._postRepo = _postRepo;
    }
    async create(createPostDTO, userId) {
        return await this._postRepo.create({ ...createPostDTO, userId });
    }
}
exports.default = new PostSevice(new post_repository_1.PostRepository());
