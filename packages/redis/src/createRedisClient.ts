import IORedis from "ioredis";

export function createRedisClient(){
  return new IORedis({
    sentinels: [{ port: 26379, host: "localhost" }],
    name: "mymaster"
  });
}
