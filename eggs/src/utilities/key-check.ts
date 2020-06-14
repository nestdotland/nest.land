import { exists } from "../deps.ts";
import { KEY_LOC } from "./files.ts";

export async function getAPIKey() {
  if (!await exists(KEY_LOC)) return;
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(await Deno.readFile(KEY_LOC));

  return content;
}
