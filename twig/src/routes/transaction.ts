import { Router } from "express";
import { ArwConnection, save } from "../arweave";
import { getType } from "mime";
import { has } from "../fs";
import * as fs from "fs";
import * as path from "path";
import readDir from "node-recursive-directory";

export default (arweave: ArwConnection) => {
  const router = Router();
  router.post("/new", async (req, res, next) => {
    let tmpID = req.body.tmpID;
    if(!has(tmpID)) return res.sendStatus(500);
    console.log(path.join(__dirname, '../../.tmp/' ,tmpID))
    const files = await readDir(path.join(__dirname, '../../.tmp/', tmpID), true); // add true
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fc = fs.readFileSync(file.fullpath);
      let txId = await save(arweave, {
          name: file.filename,
          type: getType(file.filename),
          data: fc,
      });
    }
    res.send(true)
  });
  return router;
};
