import { readJson, writeJson, semver, colors, Table } from "./deps.ts";
import { getLatestVersion } from "./registries.ts";
import { globalModulesConfigPath } from "./config.ts";

export class UpdateNotifier {
  moduleName = "";
  installName = "";
  owner = "";
  currentVersion = "";
  registry = "";
  installationArgs: string[] = [];
  lastUpdateCheck = Date.now();
  config: any = {};
  configPath = globalModulesConfigPath();

  constructor(
    public execName: string,
    public updateCheckInterval: number,
  ) {}

  async init() {
    const config = await this.readConfig();
    this.config = config;
    const module = config[this.execName];

    if (module) {
      this.moduleName = module.moduleName;
      this.installName = module.installName;
      this.owner = module.owner;
      this.currentVersion = module.version;
      this.registry = module.registry;
      this.installationArgs = module.args;
      this.lastUpdateCheck = module.lastUpdateCheck;
    } else {
      box(
        `${
          colors.red("Error")
        } ${this.execName} is missing in the global config file.`,
      );
      Deno.exit(1);
    }
  }

  async checkForUpdate() {
    if (this.needCheck()) {
      let latestVersion: string;
      try {
        latestVersion = await getLatestVersion(
          this.registry,
          this.moduleName,
          this.owner,
        );
      } catch {
        // Unsupported registry or user offline
        return;
      }

      if (!latestVersion || !semver.valid(latestVersion)) {
        return
      }

      const current = semver.coerce(this.currentVersion) || "0.0.1";
      const latest = semver.coerce(latestVersion) || "0.0.1";

      if (semver.lt(current, latest)) {
        const from = (typeof current === "string" ? current : current.version);
        const to = (typeof latest === "string" ? latest : latest.version);
        this.notify(from, to);
      }

      this.config[this.execName].lastUpdateCheck = Date.now();
      this.writeConfig(this.config);
    }
  }

  notify(from: string, to: string) {
    const notification = `New version of ${
      colors.red(this.moduleName)
    } available! ${colors.yellow(from)} → ${colors.green(to)}
Registry ${colors.cyan(this.registry)}
Run ${colors.magenta("eggs update -g " + this.installName)} to update`;

    box(notification);
  }

  async readConfig(): Promise<any> {
    try {
      const config = await readJson(this.configPath);
      return config;
    } catch {
      box(
        `${
          colors.red("Error")
        } config file doesn't exist.\nPlease reinstall the module.`,
      );
      Deno.exit(1);
    }
  }

  async writeConfig(config: any) {
    await writeJson(this.configPath, config, { spaces: 2 });
  }

  needCheck() {
    return Date.now() - this.lastUpdateCheck > this.updateCheckInterval;
  }
}

export function box(text: string) {
  console.log("");
  Table.from([[text]])
    .padding(1)
    .indent(2)
    .border(true)
    .render();
}
