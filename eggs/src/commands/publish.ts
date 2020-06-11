import {
  Command,
  existsSync,
  green,
  red,
  yellow,
  bold,
  lstatSync,
  expandGlobSync,
  path,
} from "../deps.ts";
import {
  pathExists,
} from "../utilities/files.ts";

interface IEggConfig {
  name: string;
  description?: string;
  version?: string;
  stable?: boolean;

  files: string[];
}

export const publish = new Command()
  .description("Publish the current directory to the nest.land registry.")
  .action(async () => {
    if (pathExists("egg.json")) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(await Deno.readFile("egg.json"));
      let egg;
      try {
        egg = JSON.parse(content);
      } catch (err) {
        throw err;
      }
      if (!egg.name) throw red("You must provide a name for your package!");
      if (!egg.description) console.log(yellow("You haven't provided a description for your package, continuing without one..."));
      if (!egg.version) console.log(yellow("No version found. Generating a new version now..."));
      if (!egg.files) throw red("No files to upload found. Please see the documentation to add this.");
      if (!egg.files.includes("./README.md")) console.log(yellow("No README found at project root, continuing without one..."));
      
      let matched = [];
      for (let file of egg.files) {
        let matches = 
          [
            ...expandGlobSync(file, {
              root: Deno.cwd(),
              extended: true,
            })
          ]
          .map(el => ({
            path: path.relative(Deno.cwd(), el.path),
            lstat: lstatSync(el.path),
          }))
          .filter(el => el.lstat.isFile);
        matched.push(...matches);
      }
      console.log(matched);

      const body = {

      };
      let pendingUploads = [];
      for (let file of matched) {
        let uploadResponse = await fetch("https://x.nest.land/publish", {
          method: "POST",
          headers: {
            authorization: 
          },
        });
        let uploadResponseBody: { token: string, name: string, version: string, owner: string } = await uploadResponse.json();
      }
    } else {
      throw red("You don't have an egg.json file! Please create this in the root of your repository, or see the documentation for more help.");
    }
  });
