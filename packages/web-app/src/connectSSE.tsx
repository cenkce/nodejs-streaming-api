import { emitter } from './App';

export function connectSSE() {
  const client = new EventSource("http://localhost:3001");

  client.addEventListener("update", (e) => {
    const ev = e as MessageEvent;
    ev.data && emitter.next(JSON.parse(ev.data));
  });

  client.addEventListener("tick", (e) => {
    const ev = e as MessageEvent;
    console.log("tick", ev.data);
    ev.data && emitter.next({type: "tick", data: JSON.parse(ev.data)});
  });

  client.addEventListener("tock", (e) => {
    const ev = e as MessageEvent;
    console.log("tock", ev.data);
    ev.data && emitter.next({type: "tock", data: JSON.parse(ev.data)});
  });

  client.onopen = (e) => {
    console.log("Stream connected");
  };

  client.onmessage = (e) => {
    console.log("Message : ", e.data);
  };

  client.onerror = (e) => {
    console.log("Error : ", e);
  };
}
