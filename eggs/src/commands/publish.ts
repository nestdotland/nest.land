import { Command } from "../deps.ts";

export const command = new Command()
  .alias("pb")
  .description("Publish the current directory to the nest.land registry")
  .action(() => {
    console.log("wot u looking at m8!")
  });
