import { loadConfig, getConfig } from "@lib/config";
import { connectAr } from "@lib/arweave";
import { connectDB } from "./database/driver";

import pino from "pino";

const log = pino();

export async function bootstrap() {
  try {
    const config = await loadConfig();
    const db = await connectDB(config);

    if (config.database.sync) {
      if (config.isProd) {
        log.warn(
          "You are synchronising the database in production mode! Continuing in 3 seconds",
        );

        setTimeout(async () => await db.synchronize(), 3000);
      } else {
        await db.dropDatabase();
      }

      return;
    }

    const ar = await connectAr(config);
  } catch (err) {
    log.error("An error occurred on bootsrap");
    log.error(err);
  }
}
