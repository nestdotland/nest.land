import { path } from "./deps.ts";

export function globalModulesConfigPath() {
  return path.join(Deno.dir("home") || "/", "/.eggs-global-modules.json");
}
