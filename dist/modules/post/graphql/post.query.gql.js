"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const post_service_1 = __importDefault(require("../post.service"));
const post_type_gql_1 = require("./post.type.gql");
exports.postGQLQuery = {
    post: {
        type: post_type_gql_1.PostGQLType,
        resolve: async () => {
            return await post_service_1.default.getOne(new mongoose_1.Types.ObjectId("69f5396cdbf357b59a12b3cd"));
        },
    },
};
