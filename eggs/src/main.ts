import { Command } from "./deps.ts";
import { publish } from "./commands/publish.ts";
import { keySave } from "./commands/key-save.ts";

await new Command()
  .name("eggs")
  .version("0.0.1")
  .description("nest.land - A package registry for Deno, on the permaweb")
  .command("key-save", keySave)
  .command("publish", publish)
  .parse(Deno.args);