"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.redisConnect = redisConnect;
const redis_1 = require("redis");
const config_1 = require("../config");
exports.redisClient = (0, redis_1.createClient)({
    url: config_1.REDIS_URL,
});
function redisConnect() {
    exports.redisClient.connect().then(() => {
        console.log("redis connected successfully");
    }).catch((err) => {
        console.log("fail to connect to DB");
    });
}
