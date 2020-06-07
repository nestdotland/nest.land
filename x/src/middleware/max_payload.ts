import { Context, Status } from "../deps.ts";
import { State, NextFunc } from "../utils/types.d.ts";

export async function ensureMaxPayload(
  ctx: Context<State>,
  next: NextFunc,
) {
  const len = ctx.request.headers.get("Content-Length");
  if (!len) return ctx.throw(Status.LengthRequired);
  if (Number(len) > 2048) return ctx.throw(Status.BadRequest);
  await next();
}
