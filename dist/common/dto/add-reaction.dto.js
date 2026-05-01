"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReactionSchema = void 0;
const enums_1 = require("../enums");
const zod_1 = __importDefault(require("zod"));
const constant_1 = require("../constant");
// export interface AddReactionDTO {
//   id: Types.ObjectId;
//   reaction: SYS_REACTION;
// }
exports.AddReactionSchema = zod_1.default.object({
    id: constant_1.generalFields.id,
    reaction: zod_1.default.enum(enums_1.SYS_REACTION).default(0),
});
