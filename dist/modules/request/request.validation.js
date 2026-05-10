"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDashboardQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.requestDashboardQuerySchema = zod_1.default.object({
    limit: zod_1.default.coerce.number().int().min(1).max(50).default(5),
});
