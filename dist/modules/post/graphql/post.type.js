"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostType = void 0;
const graphql_1 = require("graphql");
exports.PostType = new graphql_1.GraphQLObjectType({
    name: "ProductQuery",
    fields: {
        id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        userId: { type: graphql_1.GraphQLID },
    },
});
