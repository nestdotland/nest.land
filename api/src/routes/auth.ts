import { Router, RouteParams, Context } from "../deps.ts";
import { assertBody } from "../middleware/assertBody.ts";
import { State } from "../utils/types.d.ts";

export function auth(router: Router<RouteParams, State>) {
  router.post("/signup", assertBody, (ctx: Context<State>) => {
    ctx.assert(ctx.state.body.username);
  });
}
