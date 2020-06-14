import { config } from "dotenv";
import { connect } from "./driver";
import { validateEnv } from "./util";

config();
validateEnv(true);

async function sync() {
  const conn = await connect();
  await conn.synchronize();
  process.exit();
}

sync();
