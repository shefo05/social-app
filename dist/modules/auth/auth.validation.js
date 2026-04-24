"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.signupSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    gender: common_1.generalFields.gender,
    password: common_1.generalFields.password,
    userName: common_1.generalFields.userName,
    phoneNumber: common_1.generalFields.phoneNumber,
});
exports.loginSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    password: common_1.generalFields.password,
});
exports.forgetPasswordSchema = {};
