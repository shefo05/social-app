"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const common_1 = require("../common");
const auth_service_1 = __importDefault(require("../modules/auth/auth.service"));
const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        throw new common_1.BadRequestException("send a valid token");
    const payload = (0, common_1.verifyToken)(authorization);
    const userExist = await auth_service_1.default.checkUserExist({ _id: payload.sub });
    if (!userExist)
        throw new common_1.NotFoundException("user not found");
    req.user = userExist;
    next();
};
exports.isAuthenticated = isAuthenticated;
