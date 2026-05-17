"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = void 0;
const getPost = async () => {
    return {
        id: 100,
        content: "post1",
        attachments: ["url"],
        userId: 12345,
    };
};
exports.getPost = getPost;
