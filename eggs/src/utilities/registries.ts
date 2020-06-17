const versionSuffix = "${version}";

/** To aid in getting the owner and GitHub repo name for a 3rd party modules */
const denoDatabaseResponse = await fetch(
  "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
);
const denoRegistry = await denoDatabaseResponse.json();

/** @method getLatestVersionOfGitHubRepo
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
 * @returns {string} The latest version */
export async function getLatestVersionOfGitHubRepo(
  owner: string,
  repo: string,
): Promise<string> {
  const res = await fetch(
    "https://github.com/" + owner + "/" + repo + "/releases/latest",
  );
  const url = res.url;
  const urlSplit = url.split("/");
  const latestRelease = urlSplit[urlSplit.length - 1];
  return latestRelease;
}

export async function getLatestStdVersion(): Promise<string> {
  const res = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json",
  );
  const versions = await res.json();
  const latestVersion = versions[0];
  return latestVersion;
}

export async function getLatestXVersion(
  dependencyName: string,
): Promise<string> {
  const owner = denoRegistry[dependencyName].owner;
  const repo = denoRegistry[dependencyName].repo;
  return getLatestVersionOfGitHubRepo(owner, repo);
}

/** @method getLatestVersionFromNestRegistry
*
* @description
* Gets the latest release version of a package on https://x.nest.land
*
* @param {string} dependencyName The dependency name
*
* @example
* const latestVersion = await getLatestVersionFromNestRegistry("eggs"); // "v0.1.7"
*
* @returns {string} The latest version */
export async function getLatestVersionFromNestRegistry(
  dependencyName: string,
): Promise<string> {
  const res = await fetch("https://x.nest.land/api/package/" + dependencyName);
  const json = await res.json();
  return json.latestVersion.split("@")[1];
}

export function analyzeURL(url: string) {
  const tmpSplit = url.split("/");
  let registry = tmpSplit[2];
  let moduleName: string;
  let versionURL: string;
  let owner = "";

  switch (registry) {
    case "x.nest.land": // https://x.nest.land/remove-forever@v1.0.0/mod.ts
      moduleName = stripVersion(tmpSplit[3]);
      tmpSplit[3] = `${moduleName}@${versionSuffix}`;
      versionURL = tmpSplit.join("/");
      break;

    case "deno.land": // https://deno.land/x/remove_forever@v1.0.0/mod.ts
      moduleName = stripVersion(tmpSplit[4]);
      tmpSplit[4] = `${moduleName}@${versionSuffix}`;
      versionURL = tmpSplit.join("/");
      registry = `${registry}/${tmpSplit[3]}`;
      break;

    case "raw.githubusercontent.com": // https://raw.githubusercontent.com/oganexon/deno-remove-forever/v1.0.0/mod.ts
      moduleName = tmpSplit[4];
      tmpSplit[5] = versionSuffix;
      versionURL = tmpSplit.join("/");
      owner = tmpSplit[3];
      break;

    default:
      moduleName = "";
      versionURL = "";
      throw new Error(`Unsupported registry: ${registry}`);
  }
  return { moduleName, versionURL, registry, owner };
}

export async function getLatestVersion(
  registry: string,
  moduleName: string = "",
  owner: string = "",
) {
  switch (registry) {
    case "x.nest.land":
      return getLatestVersionFromNestRegistry(moduleName);

    case "deno.land/x":
      return getLatestXVersion(moduleName);

    case "deno.land/std":
      return getLatestStdVersion();

    case "raw.githubusercontent.com":
      return getLatestVersionOfGitHubRepo(owner, moduleName);

    default:
      throw new Error(`Unsupported registry: ${registry}`);
  }
}

function stripVersion(moduleName: string) {
  return moduleName.split("@")[0];
}
