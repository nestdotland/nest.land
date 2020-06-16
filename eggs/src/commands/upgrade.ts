import {
  Command,
  green,
  red,
  bold,
  path,
  version,
} from "../deps.ts";

export const upgrade = new Command()
  .version("0.1.0")
  .description("Upgrade the current nest.land CLI.")
  .action(async () => {
    let upgradeProcess = Deno.run({
      cmd: ["deno", "install", "--unstable", "-A", "-f", "-n", "eggs", `https://x.nest.land/eggs@${version}/mod.ts`],
      stdout: "piped",
      stderr: "piped",
    });
    let status = await upgradeProcess.status();
    upgradeProcess.close();
    console.log(bold(green("Successfully upgraded eggs cli!")));
  });
