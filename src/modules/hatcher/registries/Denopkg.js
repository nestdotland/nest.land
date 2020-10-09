import { versionSubstitute, parseModule } from "../utilities/utils";
import { Github } from "./Github";

export class Denopkg {
  /** Get the latest version of a denopkg module */
  static async getLatestVersion(module, owner) {
    return Github.getLatestVersion(module, owner);
  }

  /** Analyzes denopkg url
   * https://denopkg.com/[OWNER]/[NAME]@[VERSION]/[...].ts */
  static parseURL(url) {
    const tmpSplit = url.split("/");
    const { name, version } = parseModule(tmpSplit[4]);
    tmpSplit[4] = `${name}@${versionSubstitute}`;
    const parsedURL = tmpSplit.join("/");
    const owner = tmpSplit[3];
    const relativePath = tmpSplit.slice(5).join("/");
    return { name, version, parsedURL, owner, relativePath };
  }
}

Denopkg.domain = "denopkg.com";
