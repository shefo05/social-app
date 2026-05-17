"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutation = exports.userQuery = void 0;
const graphql_1 = require("graphql");
const user_resolve_1 = require("./user.resolve");
const user_type_1 = require("./user.type");
exports.userQuery = {
    user: {
        type: user_type_1.UserType,
        resolve: user_resolve_1.getUser,
    },
};
exports.userMutation = {
    createUser: {
        type: user_type_1.UserType,
        args: {
            id: { type: graphql_1.GraphQLID },
            name: { type: graphql_1.GraphQLString },
            email: { type: graphql_1.GraphQLString },
            password: { type: graphql_1.GraphQLString },
            phoneNumber: { type: graphql_1.GraphQLString },
        },
        resolve: user_resolve_1.createUser,
    },
};
