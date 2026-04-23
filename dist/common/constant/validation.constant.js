"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../enums");
exports.generalFields = {
    email: zod_1.default.email(),
    gender: zod_1.default.enum(enums_1.SYS_GENDER).optional(),
    password: zod_1.default
        .string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    userName: zod_1.default.string().min(2).max(20),
    phoneNumber: zod_1.default.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
};
