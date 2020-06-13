import { path, existsSync } from "../deps.ts";

export function homedir () {
  return Deno.dir("home") || "/";
}

export function pathExists (filePath: string) {
  return existsSync(filePath);
}
