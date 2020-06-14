import { config } from "dotenv";
import { connect } from "./driver";

config();

async function sync() {
  const conn = await connect();
  await conn.synchronize();
  process.exit();
}

sync();
