export { Command } from "https://deno.land/x/cliffy/command.ts";
export * as path from "https://deno.land/std/path/mod.ts";
export { existsSync, expandGlobSync } from "https://deno.land/std/fs/mod.ts";
export { bold, green, yellow, red } from "https://deno.land/std/fmt/colors.ts";

export const lstatSync = Deno.lstatSync;
