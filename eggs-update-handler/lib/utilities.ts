export function splitVersion(text: string) {
  const tmpSplit = text.split("@");
  return { moduleName: tmpSplit[0], version: tmpSplit[1] };
}

export function fetchTimeout(url: string | Request | URL, ms: number) {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal });
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
}
