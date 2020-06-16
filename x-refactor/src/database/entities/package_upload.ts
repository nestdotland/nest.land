import * as t from "typeorm";
import { FileMap } from "@lib/file_map";

@t.Entity("package-uploads")
export class PackageUpload {
  @t.PrimaryColumn("varchar", { length: 61, nullable: false, unique: true })
  name!: string;

  @t.Column("varchar", { length: 40, nullable: false })
  package!: string;

  @t.Column("varchar", { length: 20, nullable: false })
  version!: string;

  @t.Column("varchar", { length: 256, nullable: true })
  prefix!: string | null;

  @t.Column("boolean", { nullable: true })
  malicious!: boolean | null;

  @t.Column("json")
  files!: FileMap;

  @t.CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;
}
