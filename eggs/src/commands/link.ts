import {
  Command,
  green,
  red,
  bold,
  path,
} from "../deps.ts";
import { homedir } from "../utilities/files.ts";
import {
  keySuffix,
} from "../utilities/keyfile.ts";

export const link = new Command()
  .version("0.1.0")
  .description("Links your nest.land API key to the CLI")
  .action(async () => {
    if (Deno.args.length < 3) {
        console.error(red("You need to pass in your API key! To do this, add `--key <your_key>` to the end of this command."));
        Deno.exit(1);
    }
    const keyPath = path.join(homedir(), `/.nest-api-key${keySuffix}`);

    await Deno.writeFile(keyPath, new TextEncoder().encode(Deno.args[2]));
    console.log(bold(green(`Successfully updated ~/.nest-api-key${keySuffix} with your key!`)));
  });
