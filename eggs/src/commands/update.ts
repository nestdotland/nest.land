/**
 * Running this script requires the following permissions:
 *     --allow-net, --allow-read, --allow-write
 */

import { Command, existsSync } from "../deps.ts";
const decoder = new TextDecoder("utf-8");

/**
 * To aid in getting the owner and GitHub repo name for a 3rd party modules
 */
const denoDatabaseResponse = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
);
const denoRegistry = await denoDatabaseResponse.json()

/**
 * @interface ModuleToUpdate
 *
 * @description
 * What the constructed dependency objects should contain
 */
interface ModuleToUpdate {
  name: string;
  importedVersion: string;
  latestRelease: string;
  isStd: boolean;
  replaceStatement: string;
  replaceWith: string;
  updated: boolean;
}

/**
 * @method getLatestVersionOfGitHubRepo
 *
 * @description
 * Get the latest tag/release of a GitHub repository
 *
 * @param {string} owner Owner of the repository
 * @param {string} repo Repository name
 *
 * @example
 * const latestVersion = await getLatestVersionOfGitHubRepo("nestlandofficial", "nest.land");
 *
 * @returns {string} The latest version
 */
async function getLatestVersionOfGitHubRepo (owner: string, repo: string): Promise<string> {
    const res = await fetch("https://github.com/" + owner + "/" + repo + "/releases/latest");
    const url = res.url;
    const urlSplit = url.split("/");
    const latestRelease = urlSplit[urlSplit.length - 1];
    return latestRelease;
}

async function getLatestStdVersion (): Promise<string> {
  const res = await fetch("https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json");
  const versions = await res.json();
  const latestVersion = versions[0];
  return latestVersion
}

/**
 * @method getLatestVersionFromNestRegistry
 *
 * @description
 * Gets the latest release version of a package on https://x.nest.land
 *
 * @param {string} dependencyName The dependency name
 *
 * @example
 * const latestVersion = await getLatestVersionFromNestRegistry("eggs"); // "v0.1.7"
 *
 * @returns {string} The latest version
 */
async function getLatestVersionFromNestRegistry (dependencyName: string): Promise<string> {
    const res = await fetch("https://x.nest.land/api/package/" + dependencyName);
    const json = await res.json();
    return json.latestVersion.split("@")[1]
}

export const update = new Command()
    .description("Update your dependencies")
    .allowEmpty(true)
    .useRawArgs(true)
    .action(async () => {

        const args = Deno.args;

        // Get dependency filename form args
        // If --file is not present, defaults to deps.ts
        const dependencyFilename = args.filter((arg, i) => {
          return args[i - 1] === "--file"
        })[0] || "deps.ts"; // Is possible to not be an actual file

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
          pathToDepFile = Deno.realPathSync("./" + dependencyFilename)
        } catch (err) {
          // Dependency file doesnt exist
          console.error("No dependency file was found in your current working directory. Exiting...");
          Deno.exit(1)
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
            .filter(line => {
                return line.indexOf("https://") > 0
            });
        if (dependencyFileContents.length === 0) {
            console.warn("Your dependency file does not contain any imported modules. Exiting...");
            Deno.exit(1)
        }

        // Description:
        //   - If the user specifies certain dependencies to update using --deps, then we will only update those dependencies
        //   - If no requested dependencies (--deps), exit
        //   - If no --deps then update all
        //
        // Example:
        //   - Deno.args = ["update", ...]. Can include incorrect args such as --help: update http fs --help
        const requestedDependencies: string[] = args.slice(args.findIndex(val => val === "--deps") + 1 || 100) // 100 to be empty when not found
        if (args.indexOf("--deps") !== -1 && requestedDependencies.length === 0) {
          console.error("Provide dependencies to update when using --deps. Exiting...")
          Deno.exit(1)
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

            // Get if is std
            const isStd = line.indexOf("std@") !== -1;

            // Get imported version
            let tmpSplit = line.split("@"); // Expected: ["import ... https://...[std|<module>]", "<version>/..."]
            if (tmpSplit.length !== 2) { // eg not versioned
                continue
            }
            const importedVersion: string = tmpSplit[1].split("/")[0]; // "0.56.0" or "v0.56.0"

            // Get dependency name
            let name: string = isStd === true
                ? (line.split("@" + importedVersion + "/")[1]).split("/")[0]
                : tmpSplit[0].substring(
                    tmpSplit[0].lastIndexOf("/") + 1,
                    tmpSplit[0].length
                );
            // Edge case: dependency isn't a module, for example: from "https://deno.land/std@version/version.ts";, will return -> version.ts";
            if (name.indexOf(".") > 0 ) {
                name = name.split('.')[0]
            }

            // Now we have the name, ignore dependency if requested dependencies are set and it isn't one requested
            if (requestedDependencies.length && requestedDependencies.indexOf(name) === -1) {
              continue
            }

            // Get latest release
            let latestRelease = "";
            if (line.indexOf("https://deno.land/std") > 0) {
                // Collate data for std modules
                latestRelease = await getLatestStdVersion();
            }
            if (line.indexOf("https://deno.land/x/") > 0) {
                // Collate data for deno.land 3rd party modules
                const owner = denoRegistry[name].owner;
                const repo = denoRegistry[name].repo;
                latestRelease = await getLatestVersionOfGitHubRepo(owner, repo);
            }
            if (line.indexOf("https://x.nest.land") > 0) {
                latestRelease = await getLatestVersionFromNestRegistry(name);
            }

            // If imported version has a `v` and the latest version doesn't then standardise the latest version
            if (
                importedVersion.indexOf("v") === 0 && latestRelease.indexOf("v") === -1
            ) {
                latestRelease = "v" + latestRelease;
            }
            // if imported version has no `v` but latest release does then strip it
            if (
                importedVersion.indexOf("v") === -1 && latestRelease.indexOf("v") === 0
            ) {
                latestRelease = latestRelease.substring(1);
            }

            // Basic safety net
            if (!name || !importedVersion || !latestRelease || importedVersion === latestRelease) {
                continue
            }

            // Used to aid in replacing the version of dependencies
            const replaceStatement = isStd ?
                "std@" + importedVersion + "/" + name
                :
                name + "@" + importedVersion;
            const replaceWith = isStd ?
                "std@" + latestRelease + "/" + name
                :
                name + "@" + latestRelease;

            // Collate the dependency
            if (name && importedVersion && latestRelease && importedVersion !== latestRelease) {
                dependenciesToUpdate.push({
                    name,
                    importedVersion,
                    latestRelease,
                    isStd,
                    replaceStatement,
                    replaceWith,
                    updated: false
                });
            }
        }

        // If no modules are needed to update then exit
        if (dependenciesToUpdate.length === 0) {
            console.info("Your dependencies are already up to date!")
            Deno.exit()
        }

        // Loop through the users dependency file, replacing the imported version with the latest release for each dep
        let dependencyFile = decoder.decode(Deno.readFileSync(pathToDepFile));
        dependenciesToUpdate.forEach(dependency => {
          dependencyFile = dependencyFile.replace(
              // "std@" + dependency.importedVersion + "/" + dependency.name,
              // "std@" + dependency.latestRelease + "/" + dependency.name,
              dependency.replaceStatement,
              dependency.replaceWith
          );
          dependency.updated = true
        });

        // Re-write the file
        Deno.writeFileSync(
            pathToDepFile,
            new TextEncoder().encode(dependencyFile),
        );

        console.info("Updated your dependencies!")
        Deno.exit()
    });