import { Command, Input, Confirm, List, writeJson, yellow, parse } from "../deps.ts";
import { pathExists } from "../utilities/files.ts";
import { Config, ConfigFormats } from "../types.ts";
import { writeConfig } from "../utilities/writeconfig.ts";

function detectConfig(): ConfigFormats {
  if(pathExists("egg.yaml")) return "yaml";
  else if (pathExists("egg.yml")) return "yml";
  return "json";
}

export const init = new Command()
    .version("0.1.0")
    .description("Initiates a new package for the nest.land registry.")
    .action(async () => {
        let previousConfig: Config = {};
        let previousConfigFormat: ConfigFormats = detectConfig();
        if (pathExists("egg.yaml") || pathExists("egg.json") || pathExists("egg.yml")) {
            console.warn(yellow("An egg config file already exists here! Overriding..."));
            const decoder = new TextDecoder("utf-8");
            const content = decoder.decode(await Deno.readFile(`egg.${previousConfigFormat}`));
            if(["yaml", "yml"].includes(previousConfigFormat)) {
              let yamlConfig = parse(content);
              // @ts-ignore
              previousConfig = typeof yamlConfig == "object" ? yamlConfig : {};
            }
            else previousConfig = JSON.parse(content);
        };

        const pName: string = await Input.prompt({
            message: "Package name:",
            minLength: 2,
            maxLength: 40
        });
        const pDesc: string = await Input.prompt({
            message: "Package description:",
            maxLength: 4294967295,
        });
        const pStable: boolean = await Confirm.prompt("Is this a stable version?");
        const pFiles: string[] = await List.prompt("Enter the files and relative directories that nest.land will publish separated by a comma.");
        const pFormat: string = await Input.prompt({
          message: "Config format: ",
          maxLength: 10,
          minLength: 2,
        });
        const eggConfig = {
            name: pName,
            description: pDesc || previousConfig.description,
            stable: pStable,
            files: (JSON.stringify(pFiles) === '[""]' ? previousConfig.files : pFiles)
        };
        await writeConfig(eggConfig, pFormat as ConfigFormats);
    });
