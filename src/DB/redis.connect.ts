import { createClient } from "redis";
import { REDIS_URL } from "../config";

export const redisClient = createClient({
  url: REDIS_URL,
});

export function redisConnect() {
    redisClient.connect().then(() => {
        console.log("redis connected successfully");
        
    }).catch((err) => {
        console.log("fail to connect to DB");
        
    });

}

