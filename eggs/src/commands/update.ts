/** Running this script requires the following permissions:
 *  --allow-net, --allow-read, --allow-write */

import { Command, semver, analyzeURL, getLatestVersion } from "../deps.ts";
const decoder = new TextDecoder("utf-8");

/** What the constructed dependency objects should contain */
interface ModuleToUpdate {
  line: string;
  versionURL: string;
  latestRelease: string;
}

export const update = new Command<Options, Arguments>()
  .description("Update your dependencies")
  .arguments("[deps...:string]")
  .option(
    "--file <file:string>",
    "Set dependency filename, defaults to deps.ts",
    { default: "deps.ts" },
  )
  .option("-g, --global", "Update global modules")
  .action(updateModules);

async function updateModules(options: Options, requestedModules: string[]) {
  const dependencyFilename = options.file;

  // Description:
  //   - Gather the path to the user's dependency file using the CLI arguments
  //
  // Rules:
  //   - Checks for a dependency inside the directory where the user is
  //
  // Exits:
  //   - If no dependency file was found with that name, throws an error and exits
  let pathToDepFile = "";
  try {
    pathToDepFile = Deno.realPathSync("./" + dependencyFilename);
  } catch (err) {
    // Dependency file doesn't exist
    console.error(
      "No dependency file was found in your current working directory. Exiting...",
    );
    Deno.exit(1);
  }

  // Description:
  //   - Creates an array of strings from each line inside the dependency file.
  //
  // Rules:
  //   - Only extracts lines that contain "https://" to strip out non-import lines.
  //   - We only need the information around import statements
  //
  // Exits:
  //   - If no lines import from a URL (specifically lines containing "https://")
  const dependencyFileContents: string[] = decoder
    .decode(Deno.readFileSync(Deno.realPathSync(pathToDepFile)))
    .split("\n")
    .filter((line) => {
      return line.indexOf("https://") > 0;
    });
  if (dependencyFileContents.length === 0) {
    console.warn(
      "Your dependency file does not contain any imported modules. Exiting...",
    );
    Deno.exit(1);
  }

  // Description:
  //   - For each import line in the users dependency file, collate the data ready to be re-written
  //     if it can be updated
  //
  // Rules:
  //   - Only looks at dependencies imported from: deno.land/x/, deno.land/std and x.nest.land
  //   - Skips the dependency if it is not versioned (no need to try to update it)
  //
  const dependenciesToUpdate: Array<ModuleToUpdate> = [];
  for (const line of dependencyFileContents) {
    let { moduleName, versionURL, registry, owner, version } = analyzeURL(line);
    // Edge case: dependency isn't a module, for example: from "https://deno.land/std@version/version.ts";, will return -> version.ts";
    /* if (line.match(/https:\/\/deno\.land\/std(.*)\/version\.ts/)) {
                
    } */

    // Now we have the name, ignore dependency if requested dependencies are set and it isn't one requested
    if (
      requestedModules.length && requestedModules.indexOf(moduleName) === -1
    ) {
      continue;
    }

    // Get latest release
    const latestRelease = await getLatestVersion(registry, moduleName, owner);

    // Basic safety net
    if (semver.eq(version, latestRelease) || !semver.valid(version)) {
      continue;
    }

    // Collate the dependency
    dependenciesToUpdate.push({
      line,
      versionURL,
      latestRelease,
    });
  }

  // If no modules are needed to update then exit
  if (dependenciesToUpdate.length === 0) {
    console.info("Your dependencies are already up to date!");
    Deno.exit();
  }

  // Loop through the users dependency file, replacing the imported version with the latest release for each dep
  let dependencyFile = decoder.decode(Deno.readFileSync(pathToDepFile));
  dependenciesToUpdate.forEach((dependency) => {
    dependencyFile = dependencyFile.replace(
      dependency.line,
      dependency.versionURL.replace("${version}", dependency.latestRelease),
    );
  });

  // Re-write the file
  Deno.writeFileSync(
    pathToDepFile,
    new TextEncoder().encode(dependencyFile),
  );

  console.info("Updated your dependencies!");
  Deno.exit();
}

type Arguments = [string[]];

interface Options {
  file: string;
  global: boolean;
}
