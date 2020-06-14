import dotenv from "dotenv";
import { connect } from "./driver";

dotenv.config();

connect().then(async (connection) => {
  await connection.synchronize();
  process.exit();
});
