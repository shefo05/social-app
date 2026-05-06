import { createClient, RedisClientType } from "redis";
import { ICacheProvider } from "../cache.interface";

interface RedisConfig {
  url: string;
}

export class RedisCacheProvider implements ICacheProvider {
  private _client: RedisClientType;
  constructor(config: RedisConfig) {
    this._client = createClient(config);
    this._client.connect().catch((err) => {
      console.log(err);
    });
  }

  async get(key: string): Promise<string | null> {
    return await this._client.get(key);
  }
  async set(key: string, value: string, ttlSec: number): Promise<void> {
    if (ttlSec) {
      await this._client.set(key, value, { EX: ttlSec });
    }
    await this._client.set(key, value);
  }
  async delete(key: string): Promise<void> {
    await this._client.del(key);
  }
}
