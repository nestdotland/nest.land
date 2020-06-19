import { splitVersion, fetchTimeout } from "./utilities.ts";

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
    case "denopkg.com":
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

    case "denopkg.com":
      return { registry, ...analyzeDenopkg(tmpSplit) };

    default:
      throw new Error(`Unsupported registry: ${registry}`);
  }
}

/** To aid in getting the owner and GitHub repo name for a 3rd party modules */
let denoRegistry: any;

/** Fetches the deno registry only if needed */
export async function getDenoRegistry() {
  if (denoRegistry) return denoRegistry;
  const denoDatabaseResponse = await fetchTimeout(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
    5000,
  );
  denoRegistry = await denoDatabaseResponse.json();
  return denoRegistry;
}

/** Get the latest tag/release of a GitHub repository */
export async function getLatestVersionOfGitHubRepo(
  owner: string,
  repo: string,
): Promise<string> {
  const res = await fetchTimeout(
    "https://github.com/" + owner + "/" + repo + "/releases/latest",
    5000,
  );
  const url = res.url;
  const urlSplit = url.split("/");
  const latestRelease = urlSplit[urlSplit.length - 1];
  return latestRelease;
}

/** Gets the latest release version of standard deno modules */
export async function getLatestStdVersion(): Promise<string> {
  const res = await fetchTimeout(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json",
    5000,
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
  const res = await fetchTimeout(
    "https://x.nest.land/api/package/" + dependencyName,
    5000,
  );
  const json = await res.json();
  /** json.latestVersion is the latest in date but not the most up-to-date */
  const latestVersion = json.packageUploadNames.sort().pop();
  // return json.latestVersion.split("@")[1];
  return latestVersion.split("@")[1];
}

/** Analyzes x.nest.land url
 * https://x.nest.land/[NAME]@[VERSION]/[...].ts */
export function analyzeXNestLand(split: string[]) {
  const { moduleName, version } = splitVersion(split[3]);
  split[3] = `${moduleName}@${versionSubstitute}`;
  const versionURL = split.join("/");
  return { moduleName, version, versionURL };
}

/** Analyzes deno.land url
 * https://deno.land/std@[VERSION]/[...].ts
 * https://deno.land/x/[NAME]@[VERSION]/[...].ts */
export function analyzeDenoLand(split: string[]) {
  const { moduleName: xOrStd } = splitVersion(split[3]);
  if (xOrStd === "x") {
    const { moduleName, version } = splitVersion(split[4]);
    split[4] = `${moduleName}@${versionSubstitute}`;
    const versionURL = split.join("/");
    const registry = "deno.land/x";
    return { moduleName, version, versionURL, registry };
  }
  if (xOrStd === "std") {
    const { version } = splitVersion(split[3]);
    split[3] = `std@${versionSubstitute}`;
    const versionURL = split.join("/");
    const registry = "deno.land/std";
    return { moduleName: "std", version, versionURL, registry };
  }
  throw new Error(`Unable to parse deno.land url: ${split.join("/")}`);
}

/** Analyzes raw.githubusercontent url
 * https://raw.githubusercontent.com/[OWNER]/[NAME]/[VERSION]/[...].ts */
export function analyzeRawGithubusercontent(split: string[]) {
  const moduleName = split[4];
  const version = split[5];
  split[5] = versionSubstitute;
  const versionURL = split.join("/");
  const owner = split[3];
  return { moduleName, version, versionURL, owner };
}

/** Analyzes denopkg url
 * https://denopkg.com/[OWNER]/[NAME]@[VERSION]/[...].ts */
export function analyzeDenopkg(split: string[]) {
  const { moduleName, version } = splitVersion(split[4]);
  split[5] = versionSubstitute;
  const versionURL = split.join("/");
  const owner = split[3];
  return { moduleName, version, versionURL, owner };
}
