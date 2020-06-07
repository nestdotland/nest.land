import { Context, Status } from "../deps.ts";
import { fetchUser, User } from "./driver.ts";

export async function getUserWithApiKey(ctx: Context): Promise<[User | void, string | void]> {
  const [bearer, apiKey] = ctx.request
    .headers.get("Authorization")
    ?.split(" ") ?? ["", ""];

  if (bearer !== "Bearer" || !apiKey) return [void 0, void 0];

  const user = await fetchUser(apiKey, true, true);

  return [user, apiKey];
}
