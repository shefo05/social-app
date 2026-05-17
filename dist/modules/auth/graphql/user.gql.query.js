"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const auth_service_1 = __importDefault(require("../auth.service"));
const user_gql_type_1 = require("./user.gql.type");
exports.userGQLQuery = {
    user: {
        type: user_gql_type_1.UserGQLType,
        resolve: async () => {
            return await auth_service_1.default.checkUserExist({
                _id: new mongoose_1.Types.ObjectId("69f52a5c303f10a8dbbd7bdf"),
            });
        },
    },
};
