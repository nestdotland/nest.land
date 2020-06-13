import { path } from "../deps.ts";
import { pathExists, homedir } from "./files.ts";

export async function getAPIKey () {
    if (!pathExists(path.join(homedir(), ".nest-api-key"))) return false;
    const decoder = new TextDecoder("utf-8");
    const content = decoder.decode(await Deno.readFile(path.join(homedir(), ".nest-api-key")));
    return content;
}