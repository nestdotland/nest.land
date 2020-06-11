import { path, existsSync, process } from "../deps.ts";

export function getCurrentDirectoryBase() {
  return path.basename(process.cwd());
}

export function directoryExists(filePath: string) {
  return existsSync(filePath);
}
