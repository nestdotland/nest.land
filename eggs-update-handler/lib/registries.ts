export const versionSubstitute = "${version}";

/** Gets latest version from supported registries */
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

/** Analyzes an URL from supported registries */
export function analyzeURL(url: string) {
  const tmpSplit = url.split("/");
  let registry = tmpSplit[2];
  let owner = "";

  switch (registry) {
    case "x.nest.land":
      return { registry, owner, ...analyzeXNestLand(tmpSplit) };

    case "deno.land":
      return { owner, ...analyzeDenoLand(tmpSplit) };

    case "raw.githubusercontent.com":
      return { registry, ...analyzeRawGithubusercontent(tmpSplit) };

    default:
      throw new Error(`Unsupported registry: ${registry}`);
  }
}

/** To aid in getting the owner and GitHub repo name for a 3rd party modules */
let denoRegistry: any;

/** Fetches the deno registry only if needed */
export async function getDenoRegistry() {
  if (denoRegistry) return denoRegistry;
  const denoDatabaseResponse = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
  );
  denoRegistry = await denoDatabaseResponse.json();
  return denoRegistry;
}

/** Get the latest tag/release of a GitHub repository */
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

/** Gets the latest release version of standard deno modules */
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
  const denoRegistry = await getDenoRegistry();
  const owner = denoRegistry[dependencyName].owner;
  const repo = denoRegistry[dependencyName].repo;
  return getLatestVersionOfGitHubRepo(owner, repo);
}

/** Gets the latest release version of a package on https://x.nest.land */
export async function getLatestVersionFromNestRegistry(
  dependencyName: string,
): Promise<string> {
  const res = await fetch("https://x.nest.land/api/package/" + dependencyName);
  const json = await res.json();
  return json.latestVersion.split("@")[1];
}

/** Analyzes x.nest.land url
 * https://x.nest.land/[NAME]@[VERSION]/[MODULE] */
export function analyzeXNestLand(split: string[]) {
  const { moduleName, version } = splitVersion(split[3]);
  split[3] = `${moduleName}@${versionSubstitute}`;
  const versionURL = split.join("/");
  return { moduleName, version, versionURL };
}

/** Analyzes deno.land url
 * https://deno.land/[x or std]/[NAME]@[VERSION]/[MODULE] */
export function analyzeDenoLand(split: string[]) {
  const { moduleName, version } = splitVersion(split[4]);
  split[4] = `${moduleName}@${versionSubstitute}`;
  const versionURL = split.join("/");
  const registry = `deno.land/${split[3]}`;
  return { moduleName, version, versionURL, registry };
}

/** Analyzes raw.githubusercontent url
 * https://raw.githubusercontent.com/[OWNER]/[NAME]/[VERSION]/[MODULE] */
export function analyzeRawGithubusercontent(split: string[]) {
  const moduleName = split[4];
  const version = split[5];
  split[5] = versionSubstitute;
  const versionURL = split.join("/");
  const owner = split[3];
  return { moduleName, version, versionURL, owner };
}

function splitVersion(text: string) {
  const tmpSplit = text.split("@");
  return { moduleName: tmpSplit[0], version: tmpSplit[1] };
}
