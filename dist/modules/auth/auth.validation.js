"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.resetPasswordSchema = exports.sendOtpSchema = exports.verifyAccountSchema = exports.loginSchema = exports.signupSchema = void 0;
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
    FCM: zod_1.default.string().optional(),
});
exports.verifyAccountSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    otp: common_1.generalFields.otp,
});
exports.sendOtpSchema = zod_1.default.object({
    email: common_1.generalFields.email,
});
exports.resetPasswordSchema = zod_1.default.object({
    otp: common_1.generalFields.otp,
    newPassword: common_1.generalFields.password,
});
exports.updateUserSchema = zod_1.default.object({
    email: common_1.generalFields.email.optional(),
    phoneNumber: common_1.generalFields.phoneNumber.optional(),
    userName: common_1.generalFields.userName.optional(),
});
