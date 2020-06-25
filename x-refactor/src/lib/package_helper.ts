import { repos } from "@root/database/driver";
import { Package } from "@entities/Package";
import { User } from "@entities/User";

import { sanitiseName } from "./string_validation";

import { FindConditions } from "typeorm";
import { mergeDefault } from "./utils";

interface GetPackageOpts {
  sanitiseName?: boolean;
  fields?: (keyof Package)[];
}

interface GetPackageQuery {
  select?: (keyof Package)[];
  where: FindConditions<Package>;
}

export function getPackage(
  name: string,
  opts: GetPackageOpts = { sanitiseName: false },
) {
  const query: GetPackageQuery = {
    where: {},
  };

  if (opts.fields) query.select = opts.fields;
  if (opts.sanitiseName) query.where.normalizedName = sanitiseName(name);
  else query.where.name = name;

  return repos.pkg.findOne(query);
}

interface CreateOrUpdateOpts {
  pkg: Package;
  user: User;
  sanitiseName?: boolean;
  existenceAsserted?: boolean;
}

const CREATE_OR_UPDATE_DEFAULTS = {
  sanitiseName: false,
  existenceAsserted: false,
} as Required<CreateOrUpdateOpts>;

// TODO: Work on this
// @ts-expect-error
export async function createOrUpdatePackage(opts: CreateOrUpdateOpts): Package;
export async function createOrUpdatePackage(_opts: CreateOrUpdateOpts) {
  const opts = mergeDefault(CREATE_OR_UPDATE_DEFAULTS, _opts);

  if (!opts.existenceAsserted) {
    opts.existenceAsserted = !!(await getPackage(opts.pkg.name, opts));
  }
}

export function getPackageUpload(name: string, version: string) {
  return repos.pkgUpload.findOne({
    where: { name: `${name}@${version}` },
  });
}
