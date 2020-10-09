import {
  fetchTimeout,
  parseModule,
  latest,
  versionSubstitute,
  sortVersions,
} from "../utilities/utils";

export class DenoLand {
  /** Get the latest release version of third party modules */
  static async getLatestVersion(module, owner) {
    const res = await fetchTimeout(
      `https://cdn.deno.land/${module}/meta/versions.json`,
      5000
    );
    const { versions } = await res.json();
    const sorted = sortVersions(versions);
    return latest(sorted);
  }

  /** Analyzes deno.land url
   * https://deno.land/std@[VERSION]/[...].ts
   * https://deno.land/x/[NAME]@[VERSION]/[...].ts */
  static parseURL(url) {
    const tmpSplit = url.split("/");
    const owner = "";
    const { name: xOrStd } = parseModule(tmpSplit[3]);
    if (xOrStd === "x") {
      const { name, version } = parseModule(tmpSplit[4]);
      tmpSplit[4] = `${name}@${versionSubstitute}`;
      const parsedURL = tmpSplit.join("/");
      const relativePath = tmpSplit.slice(5).join("/");
      return { name, version, parsedURL, relativePath, owner };
    }
    if (xOrStd === "std") {
      const { version } = parseModule(tmpSplit[3]);
      tmpSplit[3] = `std@${versionSubstitute}`;
      const parsedURL = tmpSplit.join("/");
      const name = "std";
      const relativePath = tmpSplit.slice(4).join("/");
      return { name, version, parsedURL, relativePath, owner };
    }
    throw new Error(`Unable to parse deno.land url: ${tmpSplit.join("/")}`);
  }
}

DenoLand.domain = "deno.land";
