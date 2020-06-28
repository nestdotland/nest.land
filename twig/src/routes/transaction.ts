import { Router } from "express";
import { ArwConnection, save } from "../arweave";
import { getType } from "mime";
import { has } from "../fs";
import * as fs from "fs";
import * as path from "path";
import readDir, { FileData } from "../recursive_read";

export default (arweave: ArwConnection) => {
  const router = Router();
  router.post("/new", async (req, res, next) => {
    let tmpID = req.body.tmpID;
    if (!has(tmpID)) return res.sendStatus(500);
    let txIds = [];
    const files: FileData[] = await readDir(path.join(__dirname, "../../.tmp/", tmpID))
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let relativePath = path.relative(path.join(__dirname, "../../.tmp", tmpID), file.fullpath);
      let fc = fs.readFileSync(file.fullpath);
      let txId = await save(arweave, {
        name: file.filename,
        type: getType(file.filename),
        data: fc,
      });
      txIds.push({
        txId,
        name: file.filename,
        relativePath
      });
    }
    res.send(txIds);
  });
  return router;
};
