import "reflect-metadata";
import * as t from "typeorm";

@t.Entity("users")
export class User {

  @t.PrimaryColumn("varchar", { length: 20, nullable: false, unique: true })
  name: string;

  @t.PrimaryColumn("varchar", { length: 20, nullable: false, unique: true })
  normalizedName: string;

  @t.Column("varchar", { length: 256, nullable: false })
  password: string;

  @t.Column("varchar", { length: 256, nullable: false })
  apiKey: string;

  @t.Column("varchar", { array: true, length: 40, nullable: true })
  packageNames: string[];

  @t.CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

}

@t.Entity("packages")
export class Package {

  @t.PrimaryColumn("varchar", { length: 40, nullable: false, unique: true })
  name: string;

  @t.PrimaryColumn("varchar", { length: 40, nullable: false, unique: true })
  normalizedName: string;

  @t.Column("varchar", { length: 256, nullable: false })
  owner: string;

  @t.Column("text", { nullable: true })
  description?: string;

  @t.Column("text", { nullable: true })
  repository?: string;

  @t.Column("varchar", { length: 61, nullable: true })
  latestVersion?: string;

  @t.Column("varchar", { length: 61, nullable: true })
  latestStableVersion?: string;

  @t.Column("varchar", { array: true, length: 61, nullable: true })
  packageUploadNames: string[];

  @t.Column("boolean", { nullable: true })
  locked?: boolean;

  @t.Column("boolean", { nullable: true })
  malicious?: boolean;

  @t.Column("boolean", { nullable: true })
  unlisted?: boolean;

  @t.UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  @t.CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

}

@t.Entity("package-uploads")
export class PackageUpload {

  @t.PrimaryColumn("varchar", { length: 61, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 40, nullable: false })
  package: string;

  @t.Column("varchar", { length: 60, nullable: true })
  entry?: string;

  @t.Column("varchar", { length: 20, nullable: false })
  version: string;

  @t.Column("varchar", { length: 256, nullable: true })
  prefix?: string;

  @t.Column("boolean", { nullable: true })
  malicious?: boolean;

  @t.Column("json")
  files: { [x: string]: { inManifest: string, txId: string } };

  @t.CreateDateColumn({ type: "timestamp with time zone" })
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