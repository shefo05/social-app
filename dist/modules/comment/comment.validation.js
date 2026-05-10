"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.createCommentSchema = zod_1.default.object({
    content: common_1.generalFields.content,
    attachment: zod_1.default.string().optional(),
    mentions: zod_1.default.array(zod_1.default.string()).optional(),
});
exports.updateCommentSchema = zod_1.default.object({
    content: common_1.generalFields.content,
    attachment: zod_1.default.string().optional(),
    mentions: zod_1.default.array(zod_1.default.string()).optional(),
});
