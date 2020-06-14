import { join } from "../deps.ts";

export const HOME_DIR = Deno.dir("home") || "/";
export const KEY_LOC = join(HOME_DIR, ".nest-api-key");
