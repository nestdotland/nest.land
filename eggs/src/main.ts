import { Command } from "./deps.ts";
import { command } from "./commands/publish.ts";

await new Command()
  .name("eggs")
  .version("0.0.1")
  .description("nest.land - A package registry for Deno, on the permaweb")
  .command("publish", command)
  .parse(Deno.args);
