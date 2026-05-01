"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepo = exports.PostRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const post_model_1 = require("./post.model");
class PostRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(post_model_1.Post);
    }
}
exports.PostRepository = PostRepository;
exports.postRepo = new PostRepository();
