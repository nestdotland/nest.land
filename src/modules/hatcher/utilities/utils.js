import semver from "semver";

export const versionSubstitute = "${version}";
export const installPrefix = "hatcher--";

export function parseModule(text) {
  const tmpSplit = text.split("@");
  return { name: tmpSplit[0], version: tmpSplit[1] || "" };
}

export function fetchTimeout(url, ms) {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal });
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
}

export function sortVersions(list) {
  const valid = list
    .map((version) => semver.valid(version))
    .filter((version) => version !== null);
  return semver.sort(valid);
}

export function latest(list) {
  return list[list.length - 1];
}
