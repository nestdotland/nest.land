import { DenoLand } from "./registries/DenoLand";
import { Denopkg } from "./registries/Denopkg";
import { Github } from "./registries/Github";
import { NestLand } from "./registries/NestLand";

export const registries = [DenoLand, Denopkg, Github, NestLand];

/** Get registry object from web domain */
export function getRegistry(registryName) {
  for (const registry of registries) {
    if (registryName === registry.domain) {
      return registry;
    }
  }
  throw new Error(`Unsupported registry: ${registryName}`);
}

/** Get latest version from supported registries */
export async function getLatestVersion(registryName, module, owner = "_") {
  for (const registry of registries) {
    if (registryName === registry.domain) {
      return registry.getLatestVersion(module, owner);
    }
  }
  throw new Error(`Unsupported registry: ${registryName}`);
}

/** Parse an URL from supported registries */
export function parseURL(url) {
  const registryName = url.split("/")[2];

  for (const registry of registries) {
    if (registryName === registry.domain) {
      return {
        registry: registryName,
        ...registry.parseURL(url),
      };
    }
  }
  throw new Error(`Unsupported registry: ${registryName}`);
}

export const registryNames = {
  "deno.land": "deno.land",
  "denopkg.com": "denopkg",
  "raw.githubusercontent.com": "github",
  "x.nest.land": "nest.land",
};
