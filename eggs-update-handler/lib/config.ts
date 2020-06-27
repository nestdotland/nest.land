import { path } from "./deps.ts";

function homedir() {
  return Deno.env.get("HOME") || Deno.env.get("HOMEPATH") || Deno.env.get("USERPROFILE") || "/";
}

export function globalModulesConfigPath() {
  return path.join(homedir(), "/.eggs-global-modules.json");
}
