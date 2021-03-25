import Fastify from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { on } from "events";
import EventEmitter from "events";
import { doRedisSubcription } from "./doRedisSubcription";

export const server = Fastify({ logger: { level: "info" } });
server.register(FastifySSEPlugin);
const eventEmmitter = new EventEmitter();
let id = 0;
doRedisSubcription(eventEmmitter);

server.get("/", function (req, res) {
  res.raw.setHeader("Access-Control-Allow-Origin","*");
  
  res.sse(
    (async function* () {
      for await (const [event] of on(eventEmmitter, "update")) {
        const ev = {
          id: (id++).toString(),
          event: event.type,
          data: event.data
        }
        console.log("ev : ", ev);
        server.log.info(ev);
        yield ev;
      }
    })()
  );

  server.log.info("EventSource connection");
});

const start = async () => {
  try {
    await server.listen(3001);

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;

    let num = 0;
    const interval = setInterval(() => {
      eventEmmitter.emit("update", {type: "tick", data: (num++).toString()});
    }, 10 * 1000);
  
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
