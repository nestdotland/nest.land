import {
  Command,
  existsSync,
  green,
  red,
  yellow,
  bold,
  lstatSync,
  expandGlobSync,
  path,
  semver,
  base64,
  parse,
} from "../deps.ts";
import {
  pathExists,
  configExists,
} from "../utilities/files.ts";
import {
  getAPIKey,
  ENDPOINT,
} from "../utilities/keyfile.ts";
import {
  ConfigFormats,
} from "../types.ts";

interface IEggConfig {
  name: string;
  entry?: string;
  description?: string;
  repository?: string;
  version?: string;
  stable?: boolean;
  unlisted?: boolean;
  fmt?: boolean;

  files: string[];
}

function detectConfig(): ConfigFormats {
  if (pathExists("egg.yaml")) return "yaml";
  else if (pathExists("egg.yml")) return "yml";
  return "json";
}

function readFileBtoa(path: string) {
  const data = Deno.readFileSync(path);
  return base64.fromUint8Array(data);
}

export const publish = new Command()
  .description("Publishes the current directory to the nest.land registry.")
  .action(async () => {
    if (configExists()) {
      const decoder = new TextDecoder("utf-8");
      let configFormat = detectConfig();
      const content = decoder.decode(
        await Deno.readFile(`egg.${configFormat}`),
      );
      let egg: IEggConfig;
      if (["yaml", "yml"].includes(configFormat)) {
        let yamlConfig = parse(content);
        // @ts-ignore
        egg = typeof yamlConfig == "object" ? yamlConfig : {};
      } else {
        try {
          egg = JSON.parse(content);
        } catch (err) {
          throw err;
        }
      }
      if (!egg.name) {
        throw new Error(red("You must provide a name for your package!"));
      }
      if (!egg.description) {
        console.log(
          yellow(
            "You haven't provided a description for your package, continuing without one...",
          ),
        );
      }
      if (!egg.version) {
        console.log(
          yellow("No version found. Generating a new version now..."),
        );
      }
      if (!egg.files) {
        throw new Error(
          red(
            "No files to upload found. Please see the documentation to add this.",
          ),
        );
      }
      if (!egg.files.some((e) => /^(\.?\/)?README\.md/g.test(e))) {
        console.log(
          yellow("No README found at project root, continuing without one..."),
        );
      }

      //formatting
      if (egg.fmt) {
        const formatProcess = Deno.run({ cmd: ["deno", "fmt"] }),
          formatStatus = await formatProcess.status();

        if (formatStatus.success) {
          console.log(green("Formatted your code."));
        } else {
          throw new Error(
            red(
              `Error while formatting your code. Error code: ${formatStatus.code}`,
            ),
          );
        }
      }

      let matched = [];
      for (let file of egg.files) {
        let matches = [
          ...expandGlobSync(file, {
            root: Deno.cwd(),
            extended: true,
          }),
        ]
          .map((el) => ({
            fullPath: el.path.replace(/\\/g, "/"),
            path: "/" + path.relative(Deno.cwd(), el.path).replace(/\\/g, "/"),
            lstat: lstatSync(el.path),
          }))
          .filter((el) => el.lstat.isFile);
        matched.push(...matches);
      }

      if (egg.entry) {
        egg.entry = egg.entry?.replace(/^[.]/, "").replace(/^[^/]/, (s) =>
          `/${s}`);
      }

      if (
        !matched.find((e) => e.path === egg.entry || "/mod.ts")
      ) {
        throw new Error(
          red(`No ${egg.entry || "/mod.ts"} found. This file is required.`),
        );
      }

      let apiKey = await getAPIKey();
      if (!apiKey) {
        throw new Error(
          red(
            "No API Key file found. Please create one. Refer to the documentation on creating a " +
              bold("~/.nest-api-key") + " file.",
          ),
        );
      }

      let existingPackage = await fetch(`${ENDPOINT}/api/package/${egg.name}`)
        .catch(() => void 0);
      let existingPackageBody: {
        name: string;
        owner: string;
        description: string;
        latestVersion?: string;
        latestStableVersion?: string;
        packageUploadNames: string[];
      } | undefined = existingPackage?.ok && await existingPackage?.json();

      if (
        existingPackageBody &&
        existingPackageBody.packageUploadNames.indexOf(
            `${egg.name}@${egg.version}`,
          ) !== -1
      ) {
        throw red(
          "This version was already published. Please increment the version in egg.json.",
        );
      }

      let latestServerVersion = "0.0.0";
      if (existingPackageBody) {
        latestServerVersion = (egg.stable
          ? existingPackageBody.latestStableVersion
          : existingPackageBody.latestVersion)?.split("@")[1] || "0.0.0";

        existingPackageBody.packageUploadNames.forEach((el) => {
          if (semver.compare(el.split("@")[1], latestServerVersion) === 1) {
            latestServerVersion = el.split("@")[1];
          }
        });
      }
      egg.version = egg.version ||
        semver.inc(latestServerVersion, "patch") as string;

      let isLatest = semver.compare(egg.version, latestServerVersion) === 1;

      let uploadResponse = await fetch(`${ENDPOINT}/api/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": apiKey,
        },
        body: JSON.stringify({
          name: egg.name,
          description: egg.description,
          repository: egg.repository,
          version: egg.version,
          unlisted: egg.unlisted,
          upload: true,
          entry: egg.entry,
          latest: isLatest,
          stable: egg.stable,
        }),
      }).catch(() => {
        throw new Error(red("Something broke when publishing..."));
      });

      let fileContents = matched.map((el) =>
        [el, readFileBtoa(el.fullPath)] as [typeof el, string]
      ).reduce((p, c) => {
        p[c[0].path] = c[1];
        return p;
      }, {} as { [x: string]: string });

      if (!uploadResponse.ok) {
        throw new Error(
          red("Something broke when publishing... " + uploadResponse.status),
        );
      }
      let uploadResponseBody: {
        token: string;
        name: string;
        version: string;
        owner: string;
      } = uploadResponse.ok && await uploadResponse.json();
      let pieceResponse = await fetch(`${ENDPOINT}/api/piece`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-UploadToken": uploadResponseBody.token,
        },
        body: JSON.stringify({
          pieces: fileContents,
          end: true,
        }),
      }).catch(() => {
        throw new Error(red("Something broke when sending pieces..."));
      });

      if (!pieceResponse.ok) {
        throw new Error(
          red("Something broke when sending pieces... " + pieceResponse.status),
        );
      }
      let pieceResponseBody: { name: string; files: { [x: string]: string } } =
        await pieceResponse.json();
      console.log(
        green(`Successfully published ${bold(pieceResponseBody.name)}!`),
      );
      console.log("\r\nFiles uploaded: ");
      Object.entries(pieceResponseBody.files).map((el) => {
        console.log(
          `${el[0]} -> ${
            bold(`${ENDPOINT}/${pieceResponseBody.name}${el[0]}`)
          }`,
        );
      });
      console.log(green("You can now find your package on our registry at " + bold(`https://nest.land/package/${egg.name}\n`)));
      console.log(`Add this badge to your README to let everyone know:\n\n [![nest badge](https://nest.land/badge.svg)](https://nest.land/package/${egg.name})`);
    } else {
      throw new Error(
        red(
          "You don't have an egg.json file! Please create this in the root of your repository, or see the documentation for more help.",
        ),
      );
    }
  });
