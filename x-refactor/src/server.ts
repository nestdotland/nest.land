import { XConfig, getConfig } from "@lib/config";

import express from "express";
import { Connection } from "typeorm";
import Arweave from "arweave/node";
import pino from "pino";

const log = pino();

function setupServer(db: Connection, ar: Arweave, config: XConfig) {
  const server = express();

  // Pass this to the routers.
  const safeConfig = getConfig();

  server.listen(config.port);
}
