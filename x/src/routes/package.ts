import semver from "semver";
import { getType } from "mime";
import { Router } from "express";
import { generateToken } from "../utils/token";
import { isNameOkay } from "../utils/reservedNames";
import { save as saveTemp } from "../utils/temp";
import { Package, PackageUpload, DbConnection } from "../utils/driver";
import { ArwConnection, save, regenerateAnchor } from "../utils/arweave";

interface OngoingUpload {
  token: string;
  owner: string;
  description?: string;
  documentation?: string;
  version: string;
  name: string;
  latest: boolean;
  latestStable: boolean;
  added: number;
  pieces: { [x: number]: string };
}

const ongoingUploads = new Map<string, OngoingUpload>();

export default (database: DbConnection, arweave: ArwConnection) => {
  const router = Router();

  router.get("/packages/:limit?/:page?", async (req, res) => {
    const limit = Math.max(
      0,
      Math.min(999999999999, parseInt(req.params.limit || "999999999999", 10)),
    );

    const page = parseInt(req.params.page || "1", 10);

    const dbPackageCount = await database.repositories.Package.count();
    const dbPackages = await database.repositories.Package.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    // @ts-expect-error
    const _body = {
      page: page,
      limit: limit,
      total: dbPackageCount,
      packages: dbPackages,
    };

    return res.status(200).send(dbPackages);
  });

  router.get("/package/:package", async (req, res) => {
    const dbPackage = await database.repositories.Package.findOne({
      where: { name: req.params.package },
    });
    if (!dbPackage) return res.sendStatus(404);

    const body = { ...dbPackage };

    return res.status(200).send(body);
  });

  router.get("/package/:package/:version", async (req, res) => {
    const dbPackage = await database.repositories.Package.findOne({
      select: ["name", "owner", "description", "createdAt", "latestVersion", "latestStableVersion"],
      where: { name: req.params.package },
    });
    if (!dbPackage) return res.sendStatus(404);

    const dbPackageUpload = await database.repositories.PackageUpload.findOne({
      where: { name: `${req.params.package}@${req.params.version}` },
    });
    if (!dbPackageUpload) return res.sendStatus(404);

    const body = {
      ...dbPackageUpload,
      latest: dbPackage.latestVersion === dbPackageUpload.version ? true : undefined,
      latestStable: dbPackage.latestStableVersion === dbPackageUpload.version ? true : undefined,
      package: {
        ...dbPackage,
        latestVersion: undefined,
        latestStableVersion: undefined,
      },
    };

    return res.status(200).send(body);
  });

  router.post("/publish", async (req, res) => {
    const apiKey = req.headers["authorization"]?.toString().replace(/^Bearer /, "");
    if (!apiKey) return res.sendStatus(401);

    const dbUser = await database.repositories.User.findOne({ where: { apiKey: apiKey } });
    if (!dbUser) return res.sendStatus(401);

    let { name, description, documentation, version, latest, stable, upload } = req.body;
    if (typeof name !== "string" || name.length > 40) return res.sendStatus(400);
    if (typeof upload !== "undefined" && typeof upload !== "boolean") return res.sendStatus(400);
    if (description && typeof description !== "string") return res.sendStatus(400);
    if (documentation && typeof documentation !== "string") return res.sendStatus(400);
    if (version && (typeof version !== "string" || version.length > 20)) return res.sendStatus(400);

    if (name.indexOf("@") !== -1 || name.indexOf(" ") !== -1) return res.sendStatus(403);
    if (!isNameOkay(name) && dbUser.packageNames.indexOf(name) === -1) return res.sendStatus(403);

    if (!version) version = "0.0.1";
    if (!semver.valid(version)) return res.sendStatus(400);

    let dbPackage = await database.repositories.Package.findOne({ where: { name: name } });

    if (dbPackage && dbPackage.packageUploadNames.indexOf(`${name}@${version}`) !== -1) {
      return res.sendStatus(409);
    }

    if (dbPackage && dbPackage.owner !== dbUser.name) return res.sendStatus(403);

    if (dbPackage && dbPackage.locked) return res.sendStatus(423);

    if (dbPackage && description) {
      dbPackage.description = description;
      await database.repositories.Package.update({ name: name }, { description: description });
    }

    if (!dbPackage) {
      const pkg = new Package();
      pkg.name = name;
      pkg.owner = dbUser.name;
      pkg.latestVersion = null;
      pkg.latestStableVersion = null;
      if (description) pkg.description = description;
      pkg.packageUploadNames = [];
      await database.repositories.Package.insert(pkg);
      dbPackage = pkg;

      dbUser.packageNames = [...dbUser.packageNames, pkg.name];
      await database.repositories.User.update(
        { name: dbUser.name },
        { packageNames: dbUser.packageNames },
      );
    }

    if (upload) {
      const uploadToken = generateToken();

      ongoingUploads.set(uploadToken, {
        token: uploadToken,
        owner: dbUser.name,
        name: name,
        version: version,
        description: description,
        documentation: documentation,
        latest: latest,
        latestStable: latest && stable,
        added: Date.now(),
        pieces: {},
      });

      return res.status(202).send({
        success: true,
        token: uploadToken,
        name: `${name}@${version}`,
        owner: dbUser.name,
      });
    } else {
      return res.status(200).send({
        success: true,
        name: `${name}@${version}`,
        owner: dbUser.name,
      });
    }
  });

  router.post("/piece", async (req, res) => {
    const uploadToken = req.headers["x-uploadtoken"]!.toString();
    if (!uploadToken) return res.sendStatus(401);
    if (!ongoingUploads.has(uploadToken)) return res.sendStatus(404);

    if (!req.headers["content-length"]) return res.sendStatus(411);
    if (parseInt(req.headers["content-length"].toString()) > 20 * 1024 ** 2) return res.send(413);

    const { pieces, end } = req.body;
    if (typeof pieces !== "undefined" && typeof pieces !== "object") return res.sendStatus(400);
    if (typeof end !== "undefined" && typeof end !== "boolean") return res.sendStatus(400);

    if (
      pieces &&
      Object.entries(pieces).reduce(
        (p, c) => p || typeof c[0] !== "string" || typeof c[1] !== "string",
        false,
      )
    )
      return res.sendStatus(400);

    const newUpload = {
      ...ongoingUploads.get(uploadToken),
      pieces: {
        ...ongoingUploads.get(uploadToken)!.pieces,
        ...(pieces || {}),
      } as { [x: string]: string },
    } as OngoingUpload;

    if (end) {
      ongoingUploads.delete(uploadToken);

      await regenerateAnchor(arweave);

      const fileMap = (
        await Promise.all(
          Object.entries(newUpload.pieces).map(async ([file, content]) => {
            const fc = Buffer.from(content, "base64");
            const txId = await save(arweave, {
              name: file,
              type: getType(file)!,
              data: fc,
            });
            await saveTemp(txId, fc);
            return [file, txId];
          }),
        )
      ).reduce((p, [f, l]) => {
        p[f] = { inManifest: f, txId: l };
        return p;
      }, {} as { [x: string]: { inManifest: string; txId: string } });

      delete newUpload.pieces;

      const manifestId = await save(arweave, {
        name: "manifest.json",
        type: "application/x.arweave-manifest+json",
        data: Buffer.from(
          JSON.stringify({
            manifest: "arweave/paths",
            version: "0.1.0",
            index: {
              path: "mod.ts",
            },
            paths: Object.entries(fileMap).reduce((p, [f, l]) => {
              p[f.replace(/^\//, "")] = { id: l.txId };
              return p;
            }, {} as { [x: string]: { id: string } }),
          }),
        ),
      });
      const packageUpload = new PackageUpload();
      packageUpload.name = `${newUpload.name}@${newUpload.version}`;
      packageUpload.files = fileMap;
      packageUpload.prefix = `${arweave.api.config.protocol}://${arweave.api.config.host}/${manifestId}`;
      packageUpload.package = newUpload.name;
      packageUpload.version = newUpload.version;
      await database.repositories.PackageUpload.save(packageUpload);

      const pkg = (await database.repositories.Package.findOne({
        name: newUpload.name,
      })) as Package;
      await database.repositories.Package.update(
        { name: pkg.name },
        {
          latestStableVersion: newUpload.latestStable
            ? `${newUpload.name}@${newUpload.version}`
            : undefined,
          latestVersion: newUpload.latest ? `${newUpload.name}@${newUpload.version}` : undefined,
          packageUploadNames: [...pkg.packageUploadNames, packageUpload.name],
        },
      );

      return res.status(201).send({
        success: true,
        name: packageUpload.name,
        files: fileMap,
      });
    } else {
      ongoingUploads.set(uploadToken, newUpload);

      return res.status(202).send({
        success: true,
        token: uploadToken,
      });
    }
  });

  router.post("/cancel", async (req, res) => {
    const uploadToken = req.headers["X-UploadToken"]!.toString();
    if (!uploadToken) return res.sendStatus(401);
    if (!ongoingUploads.has(uploadToken)) return res.sendStatus(404);

    ongoingUploads.delete(uploadToken);

    return res.status(202).send({
      success: true,
      token: uploadToken,
    });
  });

  return router;
};
