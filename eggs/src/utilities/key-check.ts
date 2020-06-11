import { pathExists } from "./files.ts";

export async function verifyKeyLocation() {
    if (!pathExists("nestkey.json")) return false;
    const decoder = new TextDecoder("utf-8");
    const content = decoder.decode(await Deno.readFile("nestkey.json"));
    let keyFile;
    try {
        keyFile = JSON.parse(content);
    } catch (err) {
        throw err;
    }
    
}