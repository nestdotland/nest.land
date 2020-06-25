// ** STOP! **
// This file is not a place to dump the utility functions you make!
// This is for more programmatic helpers,
// such as object mergers or anything else of the sort.
// The only exception to this rule is to types
// Types used everywhere in can be put in this file.

type KeyedObject = Record<PropertyKey, unknown>;

export interface FileMap {
  [fileName: string]: {
    // In manifest is just the file name.
    inManifest: string;
    txId: string;
  };
}

export function isObject(potentialObj: unknown) {
  return (
    typeof potentialObj === "object" &&
    !!potentialObj &&
    potentialObj.constructor === Object
  );
}

export function mergeDefault<T extends KeyedObject, L extends Partial<T>>(
  defaultObj: T,
  looseObj: L,
): T {
  const merged = { ...looseObj } as T;
  for (const key in defaultObj) {
    const value = merged[key];
    const defaultValue = defaultObj[key];
    if (typeof value === "undefined") {
      merged[key] = defaultValue;
    } else if (isObject(value)) {
      merged[key] = mergeDefault(
        defaultValue as KeyedObject,
        value as KeyedObject,
      ) as T[typeof key];
    }
  }

  return merged;
}
