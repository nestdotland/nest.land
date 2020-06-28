import dotenv from "dotenv";
import express from "express";
import { init } from "./utils/temp";
import bodyParser from "body-parser";
import { connect as connectArweave } from "./utils/arweave";

import transactionRouter from "./routes/transaction";

dotenv.config();

async function start () {

  const server = express();
  const arweave = await connectArweave();
  const database = await connectDatabase();

  init(60, 900);

  server.disable("x-powered-by");
  server.use(bodyParser.json({ limit: "50mb" }));

  server.use("/", cdnRouter(arweave, database));

  server.all("**", (req, res, next) => {
    return res.sendStatus(404);
  });

  server.listen(parseInt(process.env.PORT), process.env.HOST, () => {
    console.log(`Started x.nest.land on http://${process.env.HOST}:${process.env.PORT}`);
  });
};

if (require.main === module) start();
