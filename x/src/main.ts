import { Application, Router, Snelm } from "./deps.ts";
import { createLogger } from "./utils/logger.ts";
import { packageRegistar } from "./registars/package.ts";
import { authRegistar } from "./registars/auth.ts";
import { setupRegistar } from "./utils/setup_registar.ts";
import { LOCAL_URI } from "./utils/arweave_api.ts";

const log = createLogger();

log.debug("Starting nest.land API");

const app = new Application();

// Snelm security middleware.
const snelm = new Snelm("oak");
await snelm.init();

setupRegistar("/api", app, packageRegistar);
setupRegistar("/api", app, authRegistar);

app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);
  next();
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  log.info(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

const pingTimout = setTimeout(() => {
  log.error("The local Arweave API is not online.");
  Deno.exit(1);
}, 500);

const resp = await fetch(LOCAL_URI);
if ((await resp.text()) === "Pong!") {
  log.debug("Recieved 'Pong!' from local Arweave API.");
  clearTimeout(pingTimout);
}

await app.listen({ port: 8080 });
