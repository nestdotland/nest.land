import * as t from "typeorm";

@t.Entity("users")
export class User {
  @t.PrimaryColumn("varchar", { length: 20, nullable: false, unique: true })
  name!: string;

  @t.Column("varchar", { length: 256, nullable: false })
  password!: string;

  @t.Column("varchar", { length: 256, nullable: false })
  apiKey!: string;

  @t.Column("varchar", { array: true, length: 40 })
  packageNames!: string[];

  @t.CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;
}
