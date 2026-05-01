"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRepo = exports.CommentRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const comment_model_1 = require("./comment.model");
class CommentRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(comment_model_1.Comment);
    }
}
exports.CommentRepository = CommentRepository;
exports.commentRepo = new CommentRepository();
