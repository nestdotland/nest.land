import * as t from "typeorm";

@t.Entity("packages")
export class Package {
  @t.PrimaryColumn("varchar", { length: 40, nullable: false, unique: true })
  name!: string;

  @t.PrimaryColumn("varchar", { length: 40, nullable: false, unique: true })
  normalizedName!: string;

  @t.Column("varchar", { length: 256, nullable: false })
  owner!: string;

  @t.Column("text", { nullable: true })
  description!: string | null;

  @t.Column("varchar", { length: 61, nullable: true })
  latestVersion!: string | null;

  @t.Column("varchar", { length: 61, nullable: true })
  latestStableVersion!: string | null;

  @t.Column("varchar", { array: true, length: 61 })
  packageUploadNames!: string[];

  @t.Column("boolean", { nullable: true })
  locked!: boolean | null;

  @t.Column("boolean", { nullable: true })
  malicious!: boolean | null;

  @t.CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;
}
