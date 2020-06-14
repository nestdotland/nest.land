import { getType } from "mime";
import { Router } from "express";
import { DbConnection } from "../utils/driver";
import { get as getTemp, has as hasTemp } from "../utils/temp";
import { get as getTransaction, ArwConnection } from "../utils/arweave";

export default (arweave: ArwConnection, database: DbConnection) => {
  const router = Router();

  router.get("/:filename*", async (req, res) => {
    const [[packageName, packageVersion], ...fileNameParts] = req.path
      .split("/")
      .slice(1)
      .map((e, i) => (i === 0 ? e.split("@") : e));

    if (!packageName || !packageVersion || !fileNameParts.length) return res.sendStatus(404);

    const dbPackage = await database.repositories.Package.findOne({ where: { name: packageName } });
    if (!dbPackage) return res.sendStatus(404);

    const dbPackageUpload = await database.repositories.PackageUpload.findOne({
      where: { name: `${packageName}@${packageVersion}` },
    });
    if (!dbPackageUpload) return res.sendStatus(404);

    const fileName = "/" + fileNameParts.join("/");
    const dbFile = dbPackageUpload.files[fileName];
    if (!dbFile) return res.sendStatus(404);

    const dbFileName = (dbPackageUpload.prefix || "") + dbFile.inManifest;

    const uploadedAgo =
      (Date.now() -
        dbPackageUpload.createdAt.getTime() +
        parseInt(process.env.TIME_OFFSET || "0")) /
        1000 +
      parseInt(process.env.TIME_OFFSET || "0");

    if ((dbPackageUpload.malicious || dbPackage.malicious) && req.query.ignoreMalicious !== "yes") {
      if (fileName.endsWith(".js") || fileName.endsWith(".ts")) {
        return res
          .type(".js")
          .send(
            `throw new Error(\`WARNING! THIS FILE (https://x.nest.land${req.url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD "?ignoreMalicious=yes" TO THE URL.\`);`,
          );
      } else if (fileName.endsWith(".json")) {
        return res.type(".json").send({
          __error: `WARNING! THIS FILE (https://x.nest.land${req.url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD "?ignoreMalicious=yes" TO THE URL.`,
        });
      } else {
        return res
          .type(".txt")
          .send(
            `WARNING! THIS FILE (https://x.nest.land${req.url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD "?ignoreMalicious=yes" TO THE URL.`,
          );
      }
    } else {
      if (await hasTemp(dbFile.txId)) {
        res.type(getType(req.path)!);
        return res.send(await getTemp(dbFile.txId));
      }

      if (uploadedAgo < 1800) {
        const data = await getTransaction(arweave, dbFile.txId);
        if (!data) return res.sendStatus(404);
        res.type(getType(req.path)!);
        return res.send(data);
      } else return res.redirect(dbFileName);
    }
  });

  return router;
};
