"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const common_1 = require("./common");
const connection_1 = require("./DB/connection");
const redis_connect_1 = require("./DB/redis.connect");
function bootstrap() {
    const app = (0, express_1.default)();
    const port = 3000;
    (0, connection_1.connectDB)();
    (0, redis_connect_1.redisConnect)();
    app.use(express_1.default.json());
    app.use("/auth", modules_1.authRouter);
    app.use((err, req, res, next) => {
        return res.status(err.cause || 500).json({
            message: err.message,
            success: false,
            details: err instanceof common_1.BadRequestException ? err.details : undefined,
        });
    });
    app.listen(port, () => {
        console.log("app is running on port", port);
    });
}
