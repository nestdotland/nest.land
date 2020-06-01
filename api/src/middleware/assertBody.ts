import { Context } from "../deps.ts";
import { BAD_REQ_PARAMS } from "../utils/errors.ts";
import { State } from "../utils/types.d.ts";

export async function assertBody(
  ctx: Context<State>,
  next: () => Promise<void>,
) {
  ctx.assert(ctx.request.hasBody, ...BAD_REQ_PARAMS);
  const body = await ctx.request.body({
    contentTypes: {
      json: ["json", "application/*+json", "application/csp-report"],
      text: ["text"],
    },
  });

  if (!body) ctx.throw(...BAD_REQ_PARAMS);

  ctx.state.body = body;

  await next();
}