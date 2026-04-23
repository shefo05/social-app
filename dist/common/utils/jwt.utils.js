"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const generateToken = (payload, secret, expireTime) => {
    const tokenPayload = {
        ...payload,
        jti: (0, crypto_1.randomUUID)(),
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, secret, {
        expiresIn: expireTime,
    });
    return token;
};
function generateTokens(payload) {
    const accessToken = generateToken(payload, "vhfdsfgkfsutgrufdkcxzvjkvuirlficubzliuxvaspi", 3600);
    const refreshToken = generateToken(payload, "kkkkkfkfkfkfkfghfsfdgfysdgyuzfcvytxcvxcuczcftvffuygastjkg", "1y");
    return { accessToken, refreshToken };
}
