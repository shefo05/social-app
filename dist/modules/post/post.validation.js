"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPostsQuerySchema = exports.updatePostSchema = exports.addReactionPostSchema = exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.createPostSchema = zod_1.default
    .object({
    content: common_1.generalFields.content,
    attachments: common_1.generalFields.attachments,
})
    .refine((data) => {
    const { attachments, content } = data;
    if (!content && (!attachments || attachments.length === 0)) {
        throw new common_1.BadRequestException("content or attachments must be provided");
    }
    return true;
});
exports.addReactionPostSchema = zod_1.default.object({
    postId: common_1.generalFields.id,
    reaction: common_1.generalFields.reaction,
});
exports.updatePostSchema = zod_1.default.object({
    content: common_1.generalFields.content,
    attachments: common_1.generalFields.attachments,
});
exports.listPostsQuerySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().int().min(1).default(1),
    limit: zod_1.default.coerce.number().int().min(1).max(50).default(10),
});
