import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { connect as connectArweave } from "./utils/arweave";
import { connect as connectDatabase } from "./utils/driver";

import cdnRouter from "./routes/cdn";
import authRouter from "./routes/auth";
import packageRouter from "./routes/package";

dotenv.config();

async function start () {

  const server = express();
  const arweave = await connectArweave();
  const database = await connectDatabase();

  server.disable("x-powered-by");
  server.use(bodyParser.json());

  if (process.env.CLOSED === "yes") {
    server.use("/api/**", (req, res, next) => {
      if (!req.headers["x-secret-salt"] || !req.headers["x-secret-hash"]) return res.sendStatus(401);
        let serverHash = crypto.createHmac("sha384", process.env.SECRET).update(req.headers["x-secret-salt"].toString()).digest("hex");
        if (serverHash !== req.headers["x-secret-hash"]) return res.sendStatus(401);

        return next();
    });
  }

  server.use("/api", authRouter(database));
  server.use("/api", packageRouter(database, arweave));
  server.use("/", cdnRouter(arweave, database));

  server.all("**", (req, res, next) => {
    return res.sendStatus(404);
  });

  server.use((err, req, res, next) => {
    try {
      return res.sendStatus(500);
    } catch (err) {
      return console.error(err);
    }
  });

  server.listen(parseInt(process.env.PORT), process.env.HOST, () => {
    console.log(`Started x.nest.land on http://${process.env.HOST}:${process.env.PORT}`);
  });
};

if (require.main === module) start();