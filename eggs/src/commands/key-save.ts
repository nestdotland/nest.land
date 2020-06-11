import { Command, green, red, bold } from "../deps.ts";
import {
  directoryExists,
} from "../utilities/files.ts";

export const keySave = new Command()
  .description(
    "Saves your API key globally so you don't need to specify it when publishing.",
  )
  .action(async () => {
    if (directoryExists("nestkey.json")) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(await Deno.readFile("nestkey.json"));
      let nestKey;
      try {
        nestKey = JSON.parse(content);
      } catch (err) {
        err.message = `${err.message}`;
        throw err;
      }
      Deno.env.set("nest-username", nestKey.username);
      Deno.env.set("nest-key", nestKey.key);
      console.log(green("Successfully updated API key!"));
    } else {
      console.log(
        red(
          "Cannot find a " + bold("nestkey.json") +
            " file in this directory!\n\n",
        ) +
          "Try running this command in the root of your project or see our documentation to create a " +
          bold("nestkey.json") + " file.",
      );
    }
  });
