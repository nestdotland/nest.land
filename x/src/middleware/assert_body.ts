import { Context } from "../deps.ts";
import { BAD_REQ_PARAMS } from "../utils/errors.ts";
import { State, NextFunc } from "../utils/types.d.ts";

export async function assertBody(
  ctx: Context<State>,
  next: NextFunc,
) {
  ctx.assert(ctx.request.hasBody, ...BAD_REQ_PARAMS);
  const body = await ctx.request.body({
    contentTypes: {
      json: ["json", "application/*+json", "application/csp-report"],
      text: ["text"],
    },
  });

  if (!body || body.type !== "json") ctx.throw(...BAD_REQ_PARAMS);

  ctx.state.body = body.value;

  await next();
}
