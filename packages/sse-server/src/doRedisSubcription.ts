import EventEmitter from "node:events";
import { server } from "./server";
import { EventMessage } from "fastify";
import { createRedisClient } from "sse-example-redis";

export function doRedisSubcription(eventEmmitter: EventEmitter) {
  //Redis subscription start
  const redisSubscriber = createRedisClient();

  redisSubscriber.subscribe("tock", (err, count) => {
    err && server.log.error("Subscription error : ", err);
  });

  const messageHandler = (channel: string, data: any) => {
    console.log("Message handler : ", channel, data);
    eventEmmitter.emit("update", JSON.parse(data));
  };

  redisSubscriber.on("message", messageHandler);

  return () => {
    redisSubscriber.unsubscribe();
    redisSubscriber.off("message", messageHandler);
  }
  // end of the Redis subscription
}
