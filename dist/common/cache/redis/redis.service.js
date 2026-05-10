"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheProvider = void 0;
const redis_1 = require("redis");
class RedisCacheProvider {
    _client;
    constructor(config) {
        this._client = (0, redis_1.createClient)(config);
        this._client.connect().catch((err) => {
            console.log(err);
        });
    }
    async getAllSet(key) {
        return await this._client.sMembers(key);
    }
    async rmSet(key, value) {
        const number = await this._client.sRem(key, value);
        return !!number;
    }
    async addToSet(key, value) {
        await this._client.sAdd(key, value);
    }
    async get(key) {
        return await this._client.get(key);
    }
    async set(key, value, ttlSec) {
        if (ttlSec) {
            await this._client.set(key, value, { EX: ttlSec });
        }
        await this._client.set(key, value);
    }
    async delete(key) {
        await this._client.del(key);
    }
}
exports.RedisCacheProvider = RedisCacheProvider;
