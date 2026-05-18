"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMutationGql = void 0;
const graphql_1 = require("graphql");
const post_service_1 = __importDefault(require("../post.service"));
const post_type_gql_1 = require("./post.type.gql");
const mongoose_1 = require("mongoose");
exports.postMutationGql = {
    addPost: {
        type: post_type_gql_1.PostGQLType,
        args: {
            content: { type: graphql_1.GraphQLString },
            attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
            userId: { type: graphql_1.GraphQLString },
        },
        resolve: async (_, args) => {
            return await post_service_1.default.create(args, new mongoose_1.Types.ObjectId(args.userId));
        },
    },
    updatePost: {
        type: post_type_gql_1.PostGQLType,
        args: {
            content: { type: graphql_1.GraphQLString },
            attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
            userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            postId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve: async (_, args) => {
            return await post_service_1.default.update(new mongoose_1.Types.ObjectId(args.postId), new mongoose_1.Types.ObjectId(args.userId), args);
        },
    },
    deletePost: {
        type: graphql_1.GraphQLBoolean,
        args: {
            postId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve: async (_, args) => {
            const deletedCount = await post_service_1.default.delete(new mongoose_1.Types.ObjectId(args.postId), new mongoose_1.Types.ObjectId(args.userId));
            return !!deletedCount;
        },
    },
};
