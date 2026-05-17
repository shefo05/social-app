"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentGQLType = void 0;
const graphql_1 = require("graphql");
const user_type_gql_1 = require("../../auth/graphql/user.type.gql");
const post_type_gql_1 = require("../../post/graphql/post.type.gql");
exports.CommentGQLType = new graphql_1.GraphQLObjectType({
    name: "CommentType",
    fields: {
        user: {
            type: user_type_gql_1.UserGQLType,
            resolve: (parent) => {
                return parent.userId;
            },
        },
        post: {
            type: post_type_gql_1.PostGQLType,
            resolve: (parent) => {
                return parent.postId;
            },
        },
        content: { type: graphql_1.GraphQLString },
        attachment: { type: graphql_1.GraphQLString },
        mentions: { type: new graphql_1.GraphQLList(user_type_gql_1.UserGQLType) },
        reactionsCount: { type: graphql_1.GraphQLInt },
    },
});
