import { Command, path } from "../deps.ts";
import { getCurrentDirectoryBase, directoryExists } from "../utilities/files.ts";

export const keySave = new Command()
    .description("Saves your API key globally so you don't need to specify it when publishing.")
    .action(() => {
        if (directoryExists('.nest-land-key')) {
            console.log("THIS ALREADY EXISTS");
        } else {
            console.log("THIS DOESN'T ALREADY EXIST");
        }
    });