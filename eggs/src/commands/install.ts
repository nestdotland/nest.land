import {
  Command,
  bold,
  yellow,
  red,
  installUpdateHandler,
  writeJson,
  readJson,
  exists,
  semver,
  getLatestVersion,
  analyzeURL,
  globalModulesConfigPath,
} from "../deps.ts";

const installPrefix = "eggs--";

const configPath = globalModulesConfigPath();

const desc = `A simple wrapper around the ${
  bold("deno install")
} command to handle global script updates.

Installs a script as an executable in the installation root's bin directory.
  eggs install --allow-net --allow-read https://deno.land/std/http/file_server.ts
  eggs install https://deno.land/std/examples/colors.ts

To change the executable name, use -n/--name:
  eggs install --allow-net --allow-read -n serve https://deno.land/std/http/file_server.ts

The executable name is inferred by default:
  - Attempt to take the file stem of the URL path. The above example would
    become 'file_server'.
  - If the file stem is something generic like 'main', 'mod', 'index' or 'cli',
    and the path has no parent, take the file name of the parent path. Otherwise
    settle with the generic name.

To change the installation root, use --root:
  eggs install --allow-net --allow-read --root /usr/local https://deno.land/std/http/file_server.ts

The installation root is determined, in order of precedence:
  - --root option
  - DENO_INSTALL_ROOT environment variable
  - $HOME/.deno

These must be added to the path manually if required.`;

export const install = new Command()
  .version("0.1.0")
  .description(desc)
  .arguments("[OPTIONS...:string]")
  .option("-A, --allow-all", "Allow all permissions")
  .option("--allow-env", "Allow environment access")
  .option("--allow-hrtime", "Allow high resolution time measurement")
  .option("--allow-net=<allow-net>", "Allow network access")
  .option("--allow-plugin", "Allow loading plugins")
  .option("--allow-read=<allow-read>", "Allow file system read access")
  .option("--allow-run", "Allow running subprocesses")
  .option("--allow-write=<allow-write>", "Allow file system write access")
  .option(
    "--cert <FILE>",
    "Load certificate authority from PEM encoded file",
  )
  .option(
    "-f, --force",
    "Forcefully overwrite existing installation",
  )
  .option(
    "-L, --log-level <log-level> ",
    "Set log level [possible values: debug, info]",
  )
  .option("-n, --name <name>", "Executable file name")
  .option("-q, --quiet", "Suppress diagnostic output")
  .option("--root <root>", "Installation root")
  .option("--unstable", "Enable unstable APIs")
  /** Unknown options cannot be parsed */
  .useRawArgs()
  .action(installModule);

async function installModule(_: any, ...args: string[]) {
  /** help option need to be parsed manually */
  if (["-h", "--help", "help"].includes(args[0])) {
    Deno.stdout.writeSync(
      new TextEncoder().encode(install.getHelp()),
    );
    Deno.exit();
  }

  const indexOfURL = args.findIndex((arg) => arg.match(/https:\/\//));
  const indexOfName = args.indexOf("-n");

  if (indexOfURL < 0) {
    console.error(red("You need to pass in a module URL."));
    Deno.exit(1);
  }

  const url = args[indexOfURL];
  let { moduleName, versionURL, registry, owner, version } = analyzeURL(url);
  let installName: string;

  const currentVersion = semver.valid(version) ??
    await getLatestVersion(registry, moduleName, owner);

  if (!currentVersion || !semver.valid(currentVersion)) {
    console.log(
      yellow(
        `Warning: could not find the latest version of ${moduleName}.\nModule will not receive any notification of updates.`,
      ),
    );
    await installModuleWithoutUpdates(args);
    Deno.exit();
  }

  /** If no exec name is given, provide one */
  if (indexOfName < 0) {
    args.splice(indexOfURL, 0, installPrefix + moduleName);
    args.splice(indexOfURL, 0, "-n");
    installName = moduleName;
  } else {
    installName = args[indexOfName + 1];
    args[indexOfName + 1] = installPrefix + installName;
  }

  const execName = installPrefix + installName;

  const result = await Promise.allSettled(
    [installUpdateHandler(installName, execName), installModuleHandler(args)],
  );

  if (result[0].status === "rejected") {
    console.error(red(`Installation failed: ${result[0].reason}`));
    Deno.exit(1);
  }
  if (result[1].status === "rejected") {
    console.error(red(`Installation failed: ${result[1].reason}`));
    Deno.exit(1);
  }

  /** After installation, the URL is ready to be updated */
  args[args.findIndex((arg) => arg.match(/https:\/\//))] = versionURL;

  const configExists = await exists(configPath);
  const config: any = configExists ? await readJson(configPath) : {};

  config[execName] = {
    registry,
    moduleName,
    installName,
    owner,
    version: currentVersion,
    args,
    lastUpdateCheck: Date.now(),
  };

  writeJson(configPath, config, { spaces: 2 });
}

async function installModuleHandler(args: string[]) {
  const installation = Deno.run({
    cmd: [
      "deno",
      "install",
      "-f",
      ...args,
    ],
    stdout: "null",
    stderr: "null",
  });

  const status = await installation.status();
  installation.close();

  if (status.success === false || status.code !== 0) {
    throw new Error("Module handler installation failed.");
  }
}

async function installModuleWithoutUpdates(args: string[]) {
  const installation = Deno.run({
    cmd: [
      "deno",
      "install",
      ...args,
    ],
  });

  const status = await installation.status();
  installation.close();

  if (status.success === false || status.code !== 0) {
    throw new Error("Module installation failed.");
  }
}
