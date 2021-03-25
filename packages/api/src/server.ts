import Fastify from "fastify";
import { createRedisClient } from "sse-example-redis";
import FastifyCors from "fastify-cors";

export const server = Fastify({ logger: { level: "error" } });
server.register(FastifyCors, { origin: true, methods: ["OPTIONS", "PUT"] });
const redisClient = createRedisClient();

let count = 0;


server.route({
  method: "PUT",
  url: "/tock",
  config: {
    Headers: { "Access-Control-Allow-Origin": "*" },
  },
  handler: function (request, reply) {
    const body = JSON.parse(request.body as any);
    redisClient.publish(
      "tock",
      JSON.stringify({ type: "tock", data: body.tock })
    );
    reply.send({ok: true});
  },
});

const start = async () => {
  try {
    await server.listen(3002);
    console.log("Server started");

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
