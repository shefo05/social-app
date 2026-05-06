import { REDIS_URL } from "../../../config";
import { RedisCacheProvider } from "./redis.service";

export const redisCacheProvider = new RedisCacheProvider({
  url: REDIS_URL,
});
