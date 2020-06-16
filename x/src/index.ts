import { createHmac } from "crypto";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import { init } from "./utils/temp";
import bodyParser from "body-parser";
import { connect as connectArweave } from "./utils/arweave";
import { connect as connectDatabase } from "./utils/driver";

import { cdnRouter } from "./routers/cdn";
import { authRouter } from "./routers/auth";
import { packageRouter } from "./routers/package";
import { validateEnv } from "./utils/util";

config();
validateEnv();

async function start() {
  const server = express();
  const arConn = await connectArweave();
  const dbConn = await connectDatabase();

  init(60, 900);

  server.disable("x-powered-by");
  server.use(bodyParser.json({ limit: "50mb" }));

  if (process.env.CLOSED === "yes") {
    server.use("/api/**", (req, res, next) => {
      if (!req.headers["x-secret-salt"] || !req.headers["x-secret-hash"]) {
        return res.sendStatus(401);
      }

      const serverHash = createHmac("sha384", process.env.SECRET!)
        .update(req.headers["x-secret-salt"].toString())
        .digest("hex");

      if (serverHash !== req.headers["x-secret-hash"]) {
        return res.sendStatus(401);
      }

      next();
    });
  }

  // Register routers.
  server.use("/api", authRouter(dbConn));
  server.use("/api", packageRouter(dbConn, arConn));
  server.use("/", cdnRouter(dbConn, arConn));

  // Route not found.
  server.all("**", (_req, res) => {
    return res.sendStatus(404);
  });

  // Error middleware.
  server.use((err: any, _req: Request, res: Response) => {
    try {
      console.error(err);
      return res.sendStatus(500);
    } catch (err) {
      return console.error(err);
    }
  });

  server.listen(parseInt(process.env.PORT!), process.env.HOST!, () => {
    console.log(
      `Started x.nest.land on http://${process.env.HOST}:${process.env.PORT}`,
    );
  });
}

if (require.main === module) start();
