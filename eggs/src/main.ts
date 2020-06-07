import { Command } from "./deps.ts";

await new Command()
  .name("eggs")
  .version("0.0.1")
  .description("nest.land - A package registry for Deno, on the permaweb")
  .parse(Deno.args);
