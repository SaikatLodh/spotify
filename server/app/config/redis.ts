import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const redis = new Redis();

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error", err));

export default redis;
