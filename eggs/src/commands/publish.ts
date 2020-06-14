import {
  Command,
  green,
  red,
  yellow,
  bold,
  expandGlob,
  semver,
  base64,
  relative,
  exists,
} from "../deps.ts";
import { getAPIKey } from "../utilities/key-check.ts";

interface IEggConfig {
  name: string;
  description?: string;
  version?: string;
  stable?: boolean;

  files: string[];
}

function readFileBtoa(path: string) {
  const data = Deno.readFileSync(path);
  return base64.fromUint8Array(data);
}

export const publish = new Command()
  .description("Publishes the current directory to the nest.land registry.")
  .action(async () => {
    if (await exists("egg.json")) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(await Deno.readFile("egg.json"));
      let egg: IEggConfig;
      try {
        egg = JSON.parse(content);
      } catch (err) {
        throw err;
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

      if (!egg.files.includes("./README.md")) {
        console.log(
          yellow("No README found at project root, continuing without one..."),
        );
      }

      const matched = [];
      for (const file of egg.files) {
        for await (
          const glob of expandGlob(file, { root: Deno.cwd(), extended: true })
        ) {
          const potentialMatch = {
            fullPath: glob.path.replace(/\\/g, "/"),
            path: "/" + relative(Deno.cwd(), glob.path).replace(/\\/g, "/"),
            lstat: await Deno.lstat(glob.path),
          };

          if (potentialMatch.lstat.isFile) matched.push(potentialMatch);
        }
      }

      if (!matched.find((e) => e.path === "/mod.ts")) {
        throw new Error(red("No /mod.ts file found. This file is required."));
      }

      const apiKey = await getAPIKey();
      if (!apiKey) {
        throw new Error(
          red(
            "No API Key file found. Please create one. Refer to the documentation on creating a " +
              bold("~/.nest-api-key") + " file.",
          ),
        );
      }

      // On error -> Probably doesn't exist.
      const existingPackage = await fetch(
        `https://x.nest.land/api/package/${egg.name}`,
      ).catch(() => void 0);

      const existingPackageBody: {
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

      if (!existingPackageBody && !egg.version) egg.version = "0.0.1";
      if (existingPackageBody && !egg.version) {
        let latestPublished = egg.stable
          ? existingPackageBody.latestStableVersion
          : existingPackageBody.latestVersion;
        if (!latestPublished) {
          latestPublished =
            existingPackageBody.packageUploadNames.slice(-1)[0] || "@0.0.0";
        }

        const incOne = semver.inc(latestPublished.split("@")[1], "patch") ||
          "0.0.1";

        egg.version = incOne;
      }

      const uploadResponse = await fetch("https://x.nest.land/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": apiKey,
        },
        body: JSON.stringify({
          name: egg.name,
          description: egg.description,
          version: egg.version,
          upload: true,
          latest: true,
          stable: egg.stable,
        }),
      }).catch((err) => {
        throw new Error(red(`Something broke... ${err}`));
      });

      const fileContents = matched.map((el) =>
        [el, readFileBtoa(el.fullPath)] as [typeof el, string]
      ).reduce((p, c) => {
        p[c[0].path] = c[1];
        return p;
      }, {} as { [x: string]: string });

      if (!uploadResponse.ok) throw new Error(red("Something broke..."));
      const uploadResponseBody: {
        token: string;
        name: string;
        version: string;
        owner: string;
      } = uploadResponse.ok && await uploadResponse.json();

      const pieceResponse = await fetch("https://x.nest.land/api/piece", {
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
        throw new Error(red("Something broke..."));
      });

      if (!pieceResponse.ok) throw new Error(red("Something broke..."));
      const pieceResponseBody: {
        name: string;
        files: { [x: string]: string };
      } = await pieceResponse.json();

      console.log(
        green(`Successfully published ${bold(pieceResponseBody.name)}!`),
      );
      console.log("\r\nFiles uploaded: ");
      Object.entries(pieceResponseBody.files).map((el) => {
        console.log(
          `${el[0]} -> ${
            bold(`https://x.nest.land/${pieceResponseBody.name}${el[0]}`)
          }`,
        );
      });
      console.log(
        green(
          "You can now find your package on our registry at" +
            bold("https://nest.land/gallery!"),
        ),
      );
    } else {
      throw new Error(
        red(
          "You don't have an egg.json file! Please create this in the root of your repository, or see the documentation for more help.",
        ),
      );
    }
  });
