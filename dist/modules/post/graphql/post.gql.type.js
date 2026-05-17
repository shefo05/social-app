"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGQLType = void 0;
const graphql_1 = require("graphql");
const user_type_gql_1 = require("../../auth/graphql/user.type.gql");
exports.PostGQLType = new graphql_1.GraphQLObjectType({
    name: "PostType",
    fields: {
        content: { type: graphql_1.GraphQLString },
        attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        reactionsCount: { type: graphql_1.GraphQLInt },
        commentsCount: { type: graphql_1.GraphQLInt },
        sharesCount: { type: graphql_1.GraphQLInt },
        user: {
            type: user_type_gql_1.UserGQLType,
            resolve: (parent) => {
                return parent.userId;
            },
        },
    },
});
