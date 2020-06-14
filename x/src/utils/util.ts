import { promises, constants } from "fs";

const { access } = promises;

export interface FileMap {
  [fileName: string]: {
    // In manifest is just the file name.
    inManifest: string;
    txId: string;
  };
}

export const isDev = process.env.NODE_ENV === "development";

export async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function getMaliciousWarning(url: string) {
  `WARNING! THIS FILE (https://x.nest.land${url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. ` +
    "IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD \"?ignoreMalicious=true\" TO THE URL.";
}

export function validateEnv() {}
