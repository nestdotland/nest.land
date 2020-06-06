import { Application, Router, Snelm } from "./deps.ts";
import { createLogger } from "./utils/logger.ts";
import { packageRegistar } from "./registars/package.ts";
import { authRegistar } from "./registars/auth.ts";
import { setupRegistar } from "./utils/setup_registar.ts";

const log = createLogger();

log.debug("Starting nest.land API");

const app = new Application();
const router = new Router();

// Snelm security middleware.
const snelm = new Snelm("oak");
await snelm.init();

setupRegistar(router, packageRegistar);
setupRegistar(router, authRegistar);

router.get("/", (ctx) => {
  ctx.response.body = JSON.stringify({ bruh: "cheese" });
});

app.use(router.routes());
app.use(router.allowedMethods());

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

await app.listen({ port: 8080 });
