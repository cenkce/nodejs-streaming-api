export function createEvent(id: any, name: string, data: string | {}) {
  return `event:${name}\ndata:${typeof data === "string" ? data : JSON.stringify(data)}\n\n\n`;
}
