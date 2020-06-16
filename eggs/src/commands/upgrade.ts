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
    let upagrdeProcess = Deno.run({
      cmd: ["deno", "install", "--unstable", "-A", "-f", "-n", "eggs", "https://x.nest.land/eggs@0.1.0/mod.ts"],
      stdout: "piped",
      stderr: "piped"
    });
    console.log(bold(green("Successfully upgraded eggs cli!")));
  });
