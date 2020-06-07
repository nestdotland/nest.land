import { Router } from "../deps.ts";

export function cdnRegistar(router: Router) {
  // TODO: Do the CDN.
  router.get("/:fileName*.(ts|js)", async ctx => {
    ctx.response.body = "TODO!";
  });
}
