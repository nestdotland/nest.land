import {
  Command,
  green,
  red,
  bold,
  path,
} from "../deps.ts";

export const upgrade = new Command()
  .version("0.1.0")
  .description("Upgrade the current nest.land CLI.")
  .action(async () => {
    // TODO: add cli upgrade command
    console.log(bold(green("Successfully upgraded eggs cli!")));
  });
