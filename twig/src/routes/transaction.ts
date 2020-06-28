import { Router } from "express";
import { ArwConnection } from "../arweave";

export default (arweave: ArwConnection) => {
  const router = Router();
  router.get()
  return router;
};
