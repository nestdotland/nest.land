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

export function normaliseName(input: string) {
  let copy = input.slice(0);

  copy = copy.toLowerCase();
  copy = copy.replace(/[-_.:]/g, "_");
  let hasInvalidCharacters = /[^a-z0-9_]/.test(copy);

  if (hasInvalidCharacters) return;
  return copy;
}