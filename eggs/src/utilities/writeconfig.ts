import { writeJson } from "../deps.ts";
import { Config, ConfigFormats } from "../types.ts";

async export function writeConfig(data: Config, format: ConfigFormats) {
  await writeJson("egg.json", data, { spaces: 2 });
}
