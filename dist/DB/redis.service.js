"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIntoCache = setIntoCache;
exports.getFromCache = getFromCache;
exports.deleteFromCache = deleteFromCache;
const redis_connect_1 = require("./redis.connect");
async function setIntoCache(key, value, expire) {
    redis_connect_1.redisClient.set(key, value, { EX: expire });
}
async function getFromCache(key) {
    return redis_connect_1.redisClient.get(key);
}
async function deleteFromCache(key) {
    redis_connect_1.redisClient.del(key);
}
