"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMutation = exports.postQuery = void 0;
const post_resolve_1 = require("./post.resolve");
const post_type_1 = require("./post.type");
exports.postQuery = {
    post: {
        type: post_type_1.PostType,
        resolve: post_resolve_1.getPost,
    },
};
exports.postMutation = {};
