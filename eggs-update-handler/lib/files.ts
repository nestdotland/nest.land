import { path, existsSync } from "./deps.ts";

export function homedir () {
  return Deno.dir("home") || "/";
}

export function pathExists (filePath: string) {
  return existsSync(filePath);
}

export function globalModulesConfigPath() {
  return path.join(homedir(), "/.eggs-global-modules.json");
}
