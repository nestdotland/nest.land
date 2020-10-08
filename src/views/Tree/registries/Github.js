import {
  fetchTimeout,
  versionSubstitute,
  sortVersions,
  latest,
} from "../utilities/utils";

export class Github {
  /** Get the latest release/tag of a GitHub repository */
  static async getLatestVersion(module, owner) {
    const res = await fetchTimeout(
      `https://api.github.com/repos/${owner}/${module}/releases`,
      5000
    );
    const json = await res.json();
    if (!Array.isArray(json)) {
      throw new Error(`${Deno.inspect(json)} is not an array`);
    }
    const versions = json.map((release) => release.tag_name);
    const sorted = sortVersions(versions);
    if (sorted.length === 0) {
      const res = await fetchTimeout(
        `https://api.github.com/repos/${owner}/${module}/tags`,
        5000
      );
      const json = await res.json();
      const versions = json.map((tag) => tag.name);
      const sorted = sortVersions(versions);
      return latest(sorted);
    }
    return latest(sorted);
  }

  /** Parse raw.githubusercontent url
   * https://raw.githubusercontent.com/[OWNER]/[NAME]/[VERSION]/[...].ts */
  static parseURL(url) {
    const tmpSplit = url.split("/");
    const name = tmpSplit[4];
    const version = tmpSplit[5];
    tmpSplit[5] = versionSubstitute;
    const parsedURL = tmpSplit.join("/");
    const owner = tmpSplit[3];
    const relativePath = tmpSplit.slice(6).join("/");
    return { name, version, parsedURL, owner, relativePath };
  }
}

Github.domain = "raw.githubusercontent.com";
