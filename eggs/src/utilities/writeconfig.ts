import { writeJson, stringify } from "../deps.ts";
import { Config, ConfigFormats } from "../types.ts";

export async function writeConfig(data: Config, format: ConfigFormats) {

  (format === "yaml" || "yml") ?
  await writeYaml(`egg.${format}`, stringify(data)) :
  await writeJson("egg.json", data, { spaces: 2 });
}

async function writeYaml(filename: string, content: string) {
  Deno.writeFileSync(filename, new TextEncoder().encode(content));
}
