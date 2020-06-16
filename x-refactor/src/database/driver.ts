import { XConfig } from "@lib/config";

import { User } from "@entities/User";
import { Package } from "@entities/Package";
import { PackageUpload } from "@entities/package_upload";

import { createConnection, Repository } from "typeorm";

interface XRepositories {
  user: Repository<User>;
  pkg: Repository<Package>;
  pkgUpload: Repository<PackageUpload>;
}

export let repos = {} as XRepositories;

export async function connectDB(config: XConfig) {
  const conn = await createConnection({
    ...config.database,

    type: "postgres",

    entities: [User, Package, PackageUpload],

    logging: config.isProd ? ["warn"] : "all",

    synchronize: false,
  });

  repos = {
    user: conn.getRepository(User),
    pkg: conn.getRepository(Package),
    pkgUpload: conn.getRepository(PackageUpload),
  };

  return conn;
}
