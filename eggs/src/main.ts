import { Command } from "./deps.ts";
import { link } from "./commands/link.ts";
import { init } from "./commands/init.ts";
import { publish } from "./commands/publish.ts";
import { update } from "./commands/update.ts";

export async function commandHandler() {
  await new Command()
    .name("eggs")
    .version("0.1.2")
    .description("nest.land - A package registry for Deno, on the permaweb")
    .command("link", link)
    .option("-k, --key <value:string>", "Your API Key")
    .command("init", init)
    .command("publish", publish)
    .command("update", update)
    .parse(Deno.args);
}
