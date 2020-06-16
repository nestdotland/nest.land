import { exists } from "./fs_util";

import { readFile } from "fs/promises";
import { createHmac, Hmac } from "crypto";

import { load } from "dotenv";
import { JWKInterface } from "arweave/node/lib/wallet";

export interface XConfig {
  // Whether or not X is in running in production mode.
  isProd: boolean;

  // The secret key.
  secretKey: Hmac | undefined;

  // The Arweave JWK.
  jwk: JWKInterface;

  host: string;
  port: number;

  database: {
    host: string;
    port: number;
    sync: boolean;
    database: string;
    username?: string;
    password?: string;
  };
}

export type SafeXConfig = Omit<XConfig, "secretKey" | "jwk" | "database">;

let isLoaded = false;
let config: Partial<XConfig> = {};

export async function loadConfig() {
  if (!isLoaded) {
    if (!(await exists("../../.env"))) {
      throw new Error(".env file is not present in X root directory");
    }

    load();

    if (!process.env.DB_ROOT) {
      throw new Error("The DB_ROOT environment variable is not defined");
    }

    if (!process.env.DB_HOST) {
      throw new Error("The DB_HOST environment variable is not defined");
    }

    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
      if (!process.env.HOST) {
        throw new Error(
          "The HOST environment variable was not defined while in production mode",
        );
      }

      if (!process.env.PORT) {
        throw new Error(
          "The PORT environment variable was not defined while in production mode",
        );
      }
    }

    // You shouldn't use a simple "||" here otherwise port 0 will not work.
    let port = parseInt(process.env.PORT!);
    if (port === NaN) port = 8080;

    // This variable is used for typechecking.
    const newConfig: XConfig = {
      isProd,

      secretKey: process.env.SECRET
        ? createHmac("sha386", process.env.SECRET)
        : void 0,

      jwk: await loadJwk(),

      port,
      host: process.env.HOST ?? "localhost",

      database: {
        host: process.env.DB_HOST.split(":").slice(0, -1).join(":"),
        port: parseInt(process.env.DB_HOST.split(":").slice(-1)[0]),
        sync: process.env.SYNC_DB === "true",
        database: process.env.DB_ROOT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      },
    };

    config = newConfig;

    isLoaded = true;
  }

  return config as XConfig;
}

export function getConfig(withSecrets?: false): SafeXConfig;
export function getConfig(withSecrets?: true): XConfig;
export function getConfig(withSecrets = false) {
  if (!isLoaded) {
    throw new Error("Can not get config when it has not been loaded");
  }

  // Allow an option to exclude the database and secret property for security reasons (e.g. prototype pollution).
  if (!withSecrets) {
    // This doesn't exactly fit the shape but using "delete" changes the v8 hidden class so the config will no longer be optimised.
    return {
      ...config,
      database: void 0,
      jwk: void 0,
      secretKey: void 0,
    } as SafeXConfig;
  }

  return config as XConfig;
}

const JWK_FILE_LOCATION = "../../arweave-key.json";

async function loadJwk() {
  if (!(await exists(JWK_FILE_LOCATION))) {
    throw new Error(
      `Arweave key (arweave-key.json) file is not present in X root directory`,
    );
  }

  const jwkData = JSON.parse(
    await readFile(JWK_FILE_LOCATION, { encoding: "utf-8" }),
  );

  return jwkData as JWKInterface;
}
