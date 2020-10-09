import {
  fetchTimeout,
  parseModule,
  versionSubstitute,
  sortVersions,
  latest,
} from "../utilities/utils";

export class NestLand {
  static async fetchModuleData(module) {
    const res = await fetchTimeout(
      "https://x.nest.land/api/package/" + module,
      5000
    );
    return res.json();
  }

  /** Get the latest release version of a package on https://x.nest.land */
  static async getLatestVersion(module, owner) {
    const json = await this.fetchModuleData(module);
    // FIXME(api): json.latestVersion is the latest in date but not the most up-to-date
    const versions = json.packageUploadNames.map(
      (module) => parseModule(module).version
    );
    const sorted = sortVersions(versions);
    return latest(sorted);
  }

  /** Get the latest stable release version of a package on https://x.nest.land */
  static async getLatestStableVersion(module) {
    const json = await this.fetchModuleData(module);
    // FIXME(api): json.latestStableVersion is the latest in date but not the most up-to-date
    return parseModule(json.latestStableVersion).version;
  }

  /** Parse x.nest.land url
   * https://x.nest.land/[NAME]@[VERSION]/[...].ts */
  static parseURL(url) {
    const tmpSplit = url.split("/");
    const { name, version } = parseModule(tmpSplit[3]);
    tmpSplit[3] = `${name}@${versionSubstitute}`;
    const parsedURL = tmpSplit.join("/");
    const relativePath = tmpSplit.slice(4).join("/");
    const owner = "";
    return { name, version, parsedURL, relativePath, owner };
  }
}

NestLand.domain = "x.nest.land";
