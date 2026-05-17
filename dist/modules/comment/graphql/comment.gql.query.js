"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const comment_service_1 = __importDefault(require("../comment.service"));
const comment_type_gql_1 = require("./comment.type.gql");
exports.commentGQLQuery = {
    comment: {
        type: comment_type_gql_1.CommentGQLType,
        resolve: async () => {
            return await comment_service_1.default.getOne({
                _id: new mongoose_1.Types.ObjectId("6a090a28d37bd0f329880b26"),
            });
        },
    },
};
