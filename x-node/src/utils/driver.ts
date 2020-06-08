import t from "typeorm";

@t.Entity()
class User {

  @t.PrimaryColumn("varchar", { length: 20, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 256, nullable: false })
  password: string;

  @t.Column("varchar", { length: 256, nullable: false })
  apiKey: string;

  @t.Column("varchar", { array: true, length: 40 })
  packageNames: string[];

  @t.Column("timestamp", { nullable: false, default: "current_timestamp" })
  createdAt: number;

}

@t.Entity()
class Package {

  @t.PrimaryColumn("varchar", { length: 40, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 256, nullable: false })
  owner: string;

  @t.Column("text", { nullable: false })
  description: string;

  @t.Column("varchar", { length: 20, nullable: false })
  latestVersion: string;

  @t.Column("varchar", { length: 20, nullable: false })
  latestStableVersion: string;

  @t.Column("varchar", { array: true, length: 61 })
  packageUploadNames: string[];

  @t.Column("timestamp", { nullable: false, default: "current_timestamp" })
  createdAt: number;

}

@t.Entity()
class PackageUpload {

  @t.PrimaryColumn("varchar", { length: 61, nullable: false, unique: true })
  name: string;

  @t.Column("varchar", { length: 20, nullable: false })
  version: string;

  @t.Column("varchar", { length: 256, nullable: false })
  documentation: string;

  @t.Column("json")
  files: { [x: string]: string }

  @t.Column("timestamp", { nullable: false, default: "current_timestamp" })
  createdAt: number;

}