import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) =>
  console.log("Redis Client Error", err)
);

redisClient
  .connect()
  .catch((err) =>
    console.log("Redis Client Connection Error", err)
  );

export default redisClient;