import { builtinModules } from "module";

export const RESERVED_NAMES = new Set([
  ...builtinModules,

  "_util",
  "archive",
  "async",
  "bytes",
  "datetime",
  "encoding",
  "examples",
  "flags",
  "fmt",
  "hash",
  "io",
  "log",
  "mime",
  "node",
  "std",
  "permissions",
  "signal",
  "testing",
  "textproto",
  "uuid",
  "ws",
  "version",

  // Package names requested to be reserved.
  "libre",
]);

// SemVer regex sourced from https://regexr.com/39s32
export const VALID_SEMVER_VER = /^(?<version>(([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;
export const VALID_PKG_UPLOAD = new RegExp(
  `^(?<name>[\-\w]+)@${VALID_SEMVER_VER.source.slice(1, -1)}$`,
);

export const BEARER_TOKEN = /^Bearer\s(?<token>[^_\W]+)$/;

export function normaliseName(input: string) {
  let copy = input.slice(0);

  copy = copy.toLowerCase();
  copy = copy.replace(/[-_.:]/g, "_");
  let hasInvalidCharacters = /[^a-z0-9_]/.test(copy);

  if (hasInvalidCharacters) return;
  return copy;
}
