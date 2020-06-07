import { Router, RouteParams, Context } from "../deps.ts";
import { assertBody } from "../middleware/assert_body.ts";
import { State } from "../utils/types.d.ts";

export function authRegistar(router: Router<RouteParams, State>) {
  router.post("/signup", assertBody, (ctx: Context<State>) => {
    ctx.assert(ctx.state.body.username);
  });
}
