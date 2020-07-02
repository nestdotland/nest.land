import { path, existsSync } from "../deps.ts";

export function homedir() {
  return Deno.env.get("HOME") || Deno.env.get("HOMEPATH") || Deno.env.get("USERPROFILE") || "/";
}

export function pathExists(filePath: string) {
  return existsSync(filePath);
}

export function configExists(): boolean {
  return existsSync("egg.json") || 
    existsSync("egg.yml") ||
    existsSync("egg.yaml");
}

export function readmeExists(): boolean {
  return existsSync("README.md");
}