import { getType } from "mime";
import { Router } from "express";
import { DBConn } from "../utils/driver";
import { get as getTemp, has as hasTemp } from "../utils/temp";
import { get as getTransaction, ArConn } from "../utils/arweave";
import { getMaliciousWarning } from "../utils/util";

const TIME_OFFSET = parseInt(process.env.TIME_OFFSET || "0");

export function cdnRouter(dbConn: DBConn, arConn: ArConn) {
  const router = Router();

  router.get("/:filename*", async (req, res) => {
    const [[packageName, packageVersion], ...fileNameParts] = req.path
      .split("/")
      .slice(1)
      .map((pathSeg, ind) => (ind === 0 ? pathSeg.split("@") : pathSeg));

    // Ensure the path satisfies the format.
    if (!packageName || !packageVersion || !fileNameParts.length) {
      return res.sendStatus(404);
    }

    const pkg = await dbConn.repos.pkg.findOne({
      where: { name: packageName },
    });

    if (!pkg) return res.sendStatus(404);

    const pkgUpload = await dbConn.repos.pkgUpload.findOne({
      where: { name: `${packageName}@${packageVersion}` },
    });

    if (!pkgUpload) return res.sendStatus(404);

    const fileName = `/${fileNameParts.join("/")}`;
    const file = pkgUpload.files[fileName];
    if (!file) return res.sendStatus(404);

    const dbFileName = `${pkgUpload.prefix ?? ""}${file.inManifest}`;

    const elapsedTimeSinceUpload =
      Date.now() -
      pkgUpload.createdAt.getTime() +
      TIME_OFFSET / 1000 +
      TIME_OFFSET;

    const sendMaliciousPkgWarn =
      (pkgUpload.malicious || pkg.malicious) &&
      !(
        req.query.ignoreMalicious === "true" ||
        req.query.ignoreMalicious === "yes"
      );

    if (sendMaliciousPkgWarn) {
      const baseWarnStr = getMaliciousWarning(req.url);

      // Throw an error for JS/TS files.
      if (fileName.endsWith(".js") || fileName.endsWith(".ts")) {
        return res.type(".js").send(`throw new Error(\`${baseWarnStr}\`);`);
      } else if (fileName.endsWith(".json")) {
        // For JSON files, send a payload with the message in __error.
        return res.type(".json").send({
          __error: getMaliciousWarning(req.url),
        });
      } else {
        // Send the plain warning as text otherwise.
        return res.type(".txt").send(baseWarnStr);
      }
    } else {
      const contentType = getType(req.path);
      if (await hasTemp(file.txId)) {
        if (contentType) res.type(contentType);
        return res.send(await getTemp(file.txId));
      }

      if (elapsedTimeSinceUpload < 1800) {
        const data = await getTransaction(arConn, file.txId);
        if (!data) return res.sendStatus(404);
        if (contentType) res.type(contentType);
        return res.send(data);
      } else return res.redirect(dbFileName);
    }
  });

  return router;
}
