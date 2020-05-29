import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Snelm } from "https://deno.land/x/snelm@1.2.0/mod.ts";

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

await app.listen({ port: 8080 });
