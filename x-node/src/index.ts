import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { connect as connectDatabase } from "./utils/driver";

import cdnRouter from "./routes/cdn";
import authRouter from "./routes/auth";

dotenv.config();

async function start () {

  const server = express();
  const database = await connectDatabase();

  server.disable("x-powered-by");
  server.use(bodyParser.json());

  server.use("/api", authRouter(database));
  server.use("/", cdnRouter(database));

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