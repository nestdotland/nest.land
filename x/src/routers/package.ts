import { getType } from "mime";
import { Router } from "express";
import { valid as validVersion } from "semver";
import { generateToken } from "../utils/token";
import { normaliseName } from "../utils/normalise";
import { isNameOkay } from "../utils/reservedNames";
import { save as saveTemp } from "../utils/temp";
import { DBConn } from "../utils/driver";
import { Package } from "../utils/entities/Package";
import { PackageUpload } from "../utils/entities/PackageUpload";
import { ArConn, save, regenerateAnchor } from "../utils/arweave";
import { FileMap } from "../utils/util";

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
  pieces: Record<string, string>;
}

const ongoingUploads = new Map<string, OngoingUpload>();

export function packageRouter(dbConn: DBConn, arConn: ArConn) {
  const router = Router();

  router.get("/packages/:limit?/:page?", async (req, res) => {
    const limit = Math.max(
      0,
      Math.min(999999999999, parseInt(req.params.limit || "999999999999", 10)),
    );

    const page = parseInt(req.params.page || "1", 10);

    const dbPackages = await dbConn.repos.pkg.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.status(200).send(dbPackages);
  });

  router.get("/package/:package", async (req, res) => {
    const pkg = await dbConn.repos.pkg.findOne({
      where: { name: req.params.package },
    });

    if (!pkg) return res.sendStatus(404);

    const body = { ...pkg };

    return res.status(200).send(body);
  });

  router.get("/package/:package/:version", async (req, res) => {
    const pkg = await dbConn.repos.pkg.findOne({
      select: [
        "name",
        "owner",
        "description",
        "createdAt",
        "latestVersion",
        "latestStableVersion",
      ],
      where: { name: req.params.package },
    });

    if (!pkg) return res.sendStatus(404);

    const pkgUpload = await dbConn.repos.pkgUpload.findOne({
      where: { name: `${req.params.package}@${req.params.version}` },
    });

    if (!pkgUpload) return res.sendStatus(404);

    const body = {
      ...pkgUpload,
      latest: pkg.latestVersion === pkgUpload.version ? true : void 0,
      latestStable:
        pkg.latestStableVersion === pkgUpload.version ? true : void 0,
      package: {
        ...pkg,
        latestVersion: void 0,
        latestStableVersion: void 0,
      },
    };

    return res.status(200).send(body);
  });

  interface PublishBody {
    name: string;
    description?: string;
    documentation?: string;
    version?: string;
    latest: boolean;
    stable: boolean;
    upload: boolean;
    unlisted: boolean;
  }

  router.post("/publish", async (req, res) => {
    const apiKey = req.headers["authorization"]
      ?.toString()
      .replace(/^Bearer /, "");

    if (!apiKey) return res.sendStatus(401);

    const user = await dbConn.repos.user.findOne({
      where: { apiKey: apiKey },
    });

    // User doesn't exist.
    if (!user) return res.sendStatus(401);

    let {
      name,
      description,
      documentation,
      version,
      latest,
      stable,
      upload,
      unlisted,
    } = req.body as PublishBody;

    /* Validate body */

    if (typeof name !== "string" || name.length > 40 || name.length < 2) {
      return res.sendStatus(400);
    }

    if (typeof upload !== "undefined" && typeof upload !== "boolean") {
      return res.sendStatus(400);
    }

    if (typeof unlisted !== "undefined" && typeof unlisted !== "boolean") {
      return res.sendStatus(400);
    }

    if (description && typeof description !== "string") {
      return res.sendStatus(400);
    }

    if (documentation && typeof documentation !== "string") {
      return res.sendStatus(400);
    }

    if (version && (typeof version !== "string" || version.length > 20)) {
      return res.sendStatus(400);
    }

    if (name.includes("@") || name.includes(" ")) {
      return res.sendStatus(403);
    }

    if (!isNameOkay(name) && user.packageNames.indexOf(name) === -1) {
      return res.sendStatus(403);
    }

    // If the version is not supplied set it. Also ensure it is a valid SemVer version.
    if (!version) version = "0.0.1";
    else if (!validVersion(version)) return res.sendStatus(400);

    // Heated debate incoming....
    const normalisedName = normaliseName(name);
    if (!normalisedName) return res.sendStatus(400);

    let pkg = await dbConn.repos.pkg.findOne({
      where: { normalizedName: normalisedName },
    });

    const pkgUploadName = `${name}@${version}`;
    let firstPublish = false;

    // The user has not published before.
    if (!pkg) {
      firstPublish = true;
      pkg = new Package();
      pkg.name = name;
      pkg.normalizedName = normalisedName;
      pkg.owner = user.name;
      pkg.latestVersion = null;
      pkg.latestStableVersion = null;
      pkg.unlisted = unlisted;
      pkg.description = description ?? null;
      pkg.packageUploadNames = [];

      await dbConn.repos.pkg.insert(pkg);

      // Update the packages that the user owns.
      user.packageNames = [...user.packageNames, pkg.name];
      await dbConn.repos.user.update(
        { name: user.name },
        { packageNames: user.packageNames },
      );
    } else {
      if (pkg.name !== name) return res.sendStatus(409);

      // If the package doesn't have the upload even when the entry exists.
      // Send a 409 (conflict) error.
      if (!pkg.packageUploadNames.includes(pkgUploadName)) {
        return res.sendStatus(409);
      }

      if (typeof unlisted !== "undefined") {
        pkg.unlisted = unlisted;
        await dbConn.repos.pkg.update({ name }, { unlisted });
      }

      if (pkg.owner !== user.name) return res.sendStatus(403);

      if (pkg.locked) return res.sendStatus(423);

      if (description) {
        // Update to the latest description.
        pkg.description = description;
        await dbConn.repos.pkg.update(
          { name: name },
          { description: description },
        );
      }
    }

    if (upload) {
      const uploadToken = generateToken();

      ongoingUploads.set(uploadToken, {
        token: uploadToken,
        owner: user.name,
        name: name,
        version: version,
        description: description,
        documentation: documentation,
        // TODO: Access the DB to get the latest version and compare it. If the user specifies the current upload is the latest version
        // we should just take their word for it in case they missed a release for instance.
        latest: firstPublish || latest,
        latestStable: latest && stable,
        added: Date.now(),
        pieces: {},
      });

      return res.status(202).send({
        success: true,
        token: uploadToken,
        name: pkgUploadName,
        owner: user.name,
      });
    } else {
      return res.status(200).send({
        success: true,
        name: pkgUploadName,
        owner: user.name,
      });
    }
  });

  interface PieceBody {
    pieces: Record<string, string>;
    end: boolean;
  }

  router.post("/piece", async (req, res) => {
    const uploadToken = req.headers["x-uploadtoken"]?.toString();
    if (!uploadToken) return res.sendStatus(401);
    if (!ongoingUploads.has(uploadToken)) return res.sendStatus(404);

    // No content-length header.
    if (!req.headers["content-length"]) return res.sendStatus(411);

    // content-length too big.
    if (parseInt(req.headers["content-length"].toString()) > 20 * 1024 ** 2) {
      return res.send(413);
    }

    const { pieces, end } = req.body as PieceBody;
    if (typeof pieces !== "undefined" && typeof pieces !== "object") {
      return res.sendStatus(400);
    }

    if (typeof end !== "undefined" && typeof end !== "boolean") {
      return res.sendStatus(400);
    }

    // Verify the object satisfies the shape we want.
    const piecesShapeValid =
      pieces &&
      Object.entries(pieces).every(
        ([fileName, contents]) =>
          typeof fileName === "string" || typeof contents === "string",
      );

    if (!piecesShapeValid) return res.sendStatus(400);

    const currentOngoingUpload = ongoingUploads.get(uploadToken)!;
    const ongoingUpload: OngoingUpload = {
      ...currentOngoingUpload,
      pieces: {
        ...currentOngoingUpload.pieces,
        ...pieces,
      },
    };

    if (end) {
      ongoingUploads.delete(uploadToken);

      arConn.anchor = await regenerateAnchor(arConn);

      const fileMap: FileMap = Object.fromEntries(
        await Promise.all(
          Object.entries(ongoingUpload.pieces).map(
            async ([fileName, contents]) => {
              const fileContentsB64 = Buffer.from(contents, "base64");
              const txId = await save(arConn, {
                name: fileName,
                type: getType(fileName) ?? "",
                data: fileContentsB64,
              });

              await saveTemp(txId, fileContentsB64);
              return [fileName, { inManifest: fileName, txId }];
            },
          ),
        ),
      );

      delete ongoingUpload.pieces;

      const manifestPaths = Object.fromEntries(
        Object.entries(fileMap).map(([fileName, { txId }]) => [
          fileName.replace(/^\//, ""),
          { id: txId },
        ]),
      );

      const manifestId = await save(arConn, {
        name: "manifest.json",
        type: "application/x.arweave-manifest+json",
        data: Buffer.from(
          JSON.stringify({
            manifest: "arweave/paths",
            version: "0.1.0",
            // TODO: This should be detected by looking at the file map and finding: [mod|main|index|start].(ts|js).
            // If this can not be found, the user should supply it. If they do not, an error should be thrown.
            index: { path: "mod.ts" },
            paths: manifestPaths,
          }),
        ),
      });

      const pkgUploadName = `${ongoingUpload.name}@${ongoingUpload.version}`;

      // Create a new package upload using the data from the ongoing upload.
      const packageUpload = new PackageUpload();
      packageUpload.name = pkgUploadName;
      packageUpload.files = fileMap;
      packageUpload.prefix = `${arConn.api.config.protocol}://${arConn.api.config.host}/${manifestId}`;
      packageUpload.package = ongoingUpload.name;
      packageUpload.version = ongoingUpload.version;
      await dbConn.repos.pkgUpload.save(packageUpload);

      const pkg = await dbConn.repos.pkg.findOne({
        name: ongoingUpload.name,
      });

      if (!pkg) return res.sendStatus(404);

      await dbConn.repos.pkg.update(
        { name: pkg.name },
        {
          latestStableVersion: ongoingUpload.latestStable
            ? pkgUploadName
            : void 0,
          latestVersion: ongoingUpload.latest ? pkgUploadName : void 0,
          packageUploadNames: [...pkg.packageUploadNames, packageUpload.name],
        },
      );

      return res.status(201).send({
        success: true,
        name: packageUpload.name,
        files: fileMap,
      });
    } else {
      ongoingUploads.set(uploadToken, ongoingUpload);

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
}
