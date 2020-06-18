import { path } from "../deps.ts";
import { pathExists, homedir } from "./files.ts";

export const ENDPOINT = Deno.env.get("EGGS_ENDPOINT") || "https://x.nest.land";
export const keySuffix = (ENDPOINT === "https://x.nest.land") ? "" : `-${ENDPOINT.replace(/[^A-Za-z0-9-_.]/g, "-")}`;

export async function getAPIKey () {
    if (!pathExists(path.join(homedir(), `.nest-api-key${keySuffix}`))) return false;
    const decoder = new TextDecoder("utf-8");
    const content = decoder.decode(await Deno.readFile(path.join(homedir(), `.nest-api-key${keySuffix}`)));
    return content;
}