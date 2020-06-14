import "reflect-metadata";

import { createConnection, Connection, Repository } from "typeorm";
import { User } from "./entities/User";
import { Package } from "./entities/Package";
import { PackageUpload } from "./entities/PackageUpload";
import { isDev } from "./util";

export interface DBConn extends Connection {
  // TypeORM repositories.
  repos: {
    user: Repository<User>;
    pkg: Repository<Package>;
    pkgUpload: Repository<PackageUpload>;
  };
}

export async function connect() {
  try {
    const conn = (await createConnection({
      type: "postgres",

      host: process.env.DB_HOST!.split(":").slice(0, -1).join(":"),
      port: parseInt(process.env.DB_HOST!.split(":").slice(-1)[0]),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_ROOT,

      entities: [User, Package, PackageUpload],

      synchronize: false,
      logging: isDev ? "all" : ["warn"],
    })) as DBConn;

    conn.repos = {
      user: conn.getRepository(User),
      pkg: conn.getRepository(Package),
      pkgUpload: conn.getRepository(PackageUpload),
    };

    return conn;
  } catch (err) {
    throw new Error("Failed to create database connection.");
  }
}
