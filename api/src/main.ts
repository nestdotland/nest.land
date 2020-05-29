import { Application, Router, Snelm } from "./deps.ts";
import { createLogger } from "./utils/logger.ts";

const log = createLogger();

log.debug("Starting nest.land API");

const app = new Application();
const router = new Router();

// Snelm security middleware.
const snelm = new Snelm("oak");
await snelm.init();

app.use((ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);

  next();
});

router.get("/", (ctx) => {
  ctx.response.body = JSON.stringify({ bruh: "cheese" });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  log.info(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

await app.listen({ port: 8080 });
