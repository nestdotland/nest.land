import { Command } from "./deps.ts";
import { link } from "./commands/link.ts";
import { init } from "./commands/init.ts";
import { publish } from "./commands/publish.ts";
import { update } from "./commands/update.ts";
import { install } from "./commands/install.ts";
import { upgrade } from "./commands/upgrade.ts";
import { version } from "./version.ts";

export async function commandHandler() {
  await new Command()
    .name("eggs")
    .version(version)
    .description("nest.land - A package registry for Deno, on the permaweb")
    .command("link", link)
    .option("-k, --key <value:string>", "Your API Key")
    .command("init", init)
    .command("publish", publish)
    .command("update", update)
    .command("install", install)
    .command("upgrade", upgrade)
    .parse(Deno.args);
}
