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
const init_1 = require("./common/cloud/s3/init");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const pipelinePromise = (0, node_util_1.promisify)(node_stream_1.pipeline);
function bootstrap() {
    const app = (0, express_1.default)();
    const port = 3000;
    app.get("/uploads/*paths", async (req, res, next) => {
        console.log(req.params.paths);
        let key = req.params.paths.join("/");
        console.log(key);
        const fileExist = await init_1.s3CloudProvider.getFile(key);
        if (!fileExist) {
            new common_1.NotFoundException("file not found");
        }
        await pipelinePromise(fileExist, res);
    });
    (0, connection_1.connectDB)();
    (0, redis_connect_1.redisConnect)();
    app.use(express_1.default.json());
    app.use("/auth", modules_1.authRouter);
    app.use("/post", modules_1.postRouter);
    app.use("/comment", modules_1.commentRouter);
    app.use("/request", modules_1.requestRouter);
    app.use((err, req, res, next) => {
        console.log(err);
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
