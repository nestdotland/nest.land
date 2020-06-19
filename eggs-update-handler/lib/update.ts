import { readJson, writeJson, path, semver, colors, Table } from "./deps.ts";
import { getLatestVersion } from "../../eggs/src/utilities/registries.ts";

export class UpdateNotifier {
  moduleName = "";
  owner = "";
  currentVersion = "";
  registry = "";
  installationArgs: string[] = [];
  lastUpdateCheck = Date.now();
  config: any = {};

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
Run ${colors.magenta("eggs update -g " + this.execName)} to update`;

    box(notification);
  }

  async readConfig(): Promise<any> {
    try {
      const config = await readJson(this.configPath());
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
    await writeJson(this.configPath(), config, { spaces: 2 });
  }

  configPath() {
    const homedir = Deno.dir("home") || "/";
    return path.join(homedir, "/.eggs-global-modules.json");
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
