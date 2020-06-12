import "reflect-metadata";
import * as t from "typeorm";

@t.Entity("users")
export class User {

  @t.PrimaryColumn("varchar", { length: 20, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 256, nullable: false })
  password: string;

  @t.Column("varchar", { length: 256, nullable: false })
  apiKey: string;

  @t.Column("varchar", { array: true, length: 40 })
  packageNames: string[];

  @t.CreateDateColumn()
  createdAt: Date;

}

@t.Entity("packages")
export class Package {

  @t.PrimaryColumn("varchar", { length: 40, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 256, nullable: false })
  owner: string;

  @t.Column("text", { nullable: true })
  description: string;

  @t.Column("varchar", { length: 20, nullable: true })
  latestVersion: string;

  @t.Column("varchar", { length: 20, nullable: true })
  latestStableVersion: string;

  @t.Column("varchar", { array: true, length: 61 })
  packageUploadNames: string[];

  @t.Column("boolean", { nullable: true })
  locked: boolean;

  @t.Column("boolean", { nullable: true })
  malicious: boolean;

  @t.CreateDateColumn()
  createdAt: Date;

}

@t.Entity("package-uploads")
export class PackageUpload {

  @t.PrimaryColumn("varchar", { length: 61, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 40, nullable: false })
  package: string;

  @t.Column("varchar", { length: 20, nullable: false })
  version: string;

  @t.Column("varchar", { length: 256, nullable: true })
  prefix: string;

  @t.Column("boolean", { nullable: true })
  malicious: boolean;

  @t.Column("json")
  files: { [x: string]: { id: string, path: string } }

  @t.CreateDateColumn()
  createdAt: Date;

}

export type DbConnection = t.Connection & { repositories: { User: t.Repository<User>, Package: t.Repository<Package>, PackageUpload: t.Repository<PackageUpload> } };

export async function connect () {
  try {
    const connection: t.Connection = await t.createConnection({
      type: "postgres",

      host: process.env.DB_HOST.split(":").slice(0, -1).join(":"),
      port: parseInt(process.env.DB_HOST.split(":").slice(-1)[0]),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_ROOT,

      entities: [
        User,
        Package,
        PackageUpload
      ],

      synchronize: false,
      logging: process.env.NODE_ENV === "production" ? undefined : true
    });

    let repositories = {
      User: connection.getRepository(User),
      Package: connection.getRepository(Package),
      PackageUpload: connection.getRepository(PackageUpload),
    };

    (connection as any).repositories = repositories;

    return connection as DbConnection;
  } catch (err) {
    throw new Error("Failed to create database connection.");
  }
}