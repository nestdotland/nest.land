import { Command, yellow } from "../deps.ts";
import { pathExists } from "../utilities/files.ts";

export const init = new Command()
    .description("Initiates a new package for the nest.land registry.")
    .action(() => {
        if (pathExists("egg.json")) throw yellow("An egg.json file already exists here!");
        Deno.create("");
    });