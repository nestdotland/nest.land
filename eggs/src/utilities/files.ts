import { path, existsSync } from "../deps.ts";

export function getCurrentDirectoryBase() {
  return path.basename(Deno.cwd());
}

export function pathExists(filePath: string) {
  return existsSync(filePath);
}
