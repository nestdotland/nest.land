import { Router } from "express";
import { ArwConnection } from "../arweave";

export default (arweave: ArwConnection) => {
  const router = Router();
  router.post("/new", (req, res, next) => {
    /**  let txId = await save(arweave, {
        name: file,
        type: getType(file),
        data: fc,
      }); **/
  });
  return router;
};
