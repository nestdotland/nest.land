import { Router } from "express";
import { DbConnection } from "../utils/driver";

export default (database: DbConnection) => {
  const router = Router();

  router.get("/:filename*", async (req, res) => {
    let [ [ packageName, packageVersion ], ...fileNameParts ] = req.path.split("/").slice(1).map((e, i) => (i === 0) ? e.split("@") : e);
    if (!packageName || !packageVersion || !fileNameParts.length) return res.sendStatus(404);

    let dbPackage = await database.repositories.Package.findOne({ where: { name: packageName } });
    if (!dbPackage) return res.sendStatus(404);

    let dbPackageUpload = await database.repositories.PackageUpload.findOne({ where: { name: `${packageName}@${packageVersion}` } });
    if (!dbPackageUpload) return res.sendStatus(404);

    let fileName = "/" + fileNameParts.join("/");
    let dbFile = dbPackageUpload.files[fileName];
    if (!dbFile) return res.sendStatus(404);

    let dbFileName = (dbPackageUpload.prefix || "") + dbFile;

    if ((dbPackageUpload.malicious || dbPackage.malicious) && req.query.ignoreMalicious !== "yes") {
      if (fileName.endsWith(".js") || fileName.endsWith(".ts")) {
        return res.type(".js").send(`throw new Error(\`WARNING! THIS FILE (https://x.nest.land${req.url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD "?ignoreMalicious=yes" TO THE URL.\`);`);
      } else if (fileName.endsWith(".json")) {
        return res.type(".json").send({ __error: `WARNING! THIS FILE (https://x.nest.land${req.url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD "?ignoreMalicious=yes" TO THE URL.` });
      } else {
        return res.type(".txt").send(`WARNING! THIS FILE (https://x.nest.land${req.url}) IS KNOWN TO NEST.LAND TO BE A MALICIOUS FILE. IF YOU WANT TO DISABLE THIS WARNING, PLEASE ADD "?ignoreMalicious=yes" TO THE URL.`);
      }
    } else {
      return res.redirect(dbFileName);
    }

  });

  return router;
};