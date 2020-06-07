import { MongoClient, prerelease } from "../deps.ts";

export const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

export const db = client.database("nest-land");

export const users = db.collection("users");
export const packages = db.collection("packages");
export const packageUploads = db.collection("packageUploads");

export interface PackageUpload {
  // _id is the name + version.
  _id: string;
  version: string;
  description: string;
  documentation?: string;
  uploadedAt: Date;
  fileMap: Record<string, string>;
}

export interface Package {
  // _id is the name of the package.
  // Which is the displayname of the latest stable version.
  _id: string;
  owner: string;

  // Owner of the latest stable version.
  description: string;
  latestVersion: string;
  latestStableVersion: string;
  packageUploadIds: string[];
  uploads: PackageUpload[];
}

export interface User {
  // _id is the username.
  _id: string;
  apiKey: string;
  passwordHash: string;
  packageIds: string[];
  packages: Package[];
}

export async function createUser(user: Omit<User, "packages">) {
  await users.insertOne(user);
}

export async function fetchUser(
  usernameOrKey: string,
  apiKey = false,
  withPkgs = false,
): Promise<User | void> {
  const matchCriteria = apiKey
    ? { apiKey: usernameOrKey }
    : { _id: usernameOrKey };

  if (withPkgs) {
    const usersRes: User[] = await users.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: "packages",
          localField: "packageIds",
          foreignField: "_id",
          as: "packages",
        },
      },
    ]);

    return usersRes?.[0];
  }

  const user: User = await users.findOne(matchCriteria);
  if (!user) return;

  user.packages = [];

  return user;
}

export async function createPackage(pkg: Package) {
  await users.insertOne(pkg);
}

export async function createUpload(
  pkg: Package | string,
  update = false,
  ownerId: string,
  upload: Omit<PackageUpload, "uploadedAt" | "_id">,
) {
  const _id = typeof pkg !== "string" ? pkg._id : pkg;
  const freshPkg = ((await getPackage(_id)) as Package) ?? {
    _id,
    owner: ownerId,
    description: upload.description,
    latestVersion: upload.version,
    latestStableVersion: upload.version,
    packageUploadIds: [],
    uploads: [],
  };

  const exists = !!(await packages.count({ _id }));
  if (!!exists) throw new Error("Package Upload already exists!");

  const _upload: PackageUpload = {
    _id: `${_id}@${upload.version}`,
    uploadedAt: new Date(),
    ...upload,
  };

  await packageUploads.insertOne(_upload);

  const isPre = prerelease(upload.version);
  if (!isPre) freshPkg.latestStableVersion = upload.version;
  freshPkg.latestVersion = upload.version;

  freshPkg.packageUploadIds.push(_upload._id);

  if (update) await packages.updateOne({ _id }, freshPkg);
  else await createPackage(freshPkg);
}

export async function getPackages(getUploads = false) {
  const pkgRes: PackageUpload[] = await packages.aggregate([
    {
      $lookup: {
        from: "packageUploads",
        localField: "packageUploadIds",
        foreignField: "_id",
        as: "uploads",
      },
    },
  ]);

  return pkgRes;
}

export async function getPackage(pkg: Package | string, getUploads = false) {
  const _id = typeof pkg !== "string" ? pkg._id : pkg;

  const pkgRes = (await packages.aggregate([
    { $match: { _id } },
    {
      $lookup: {
        from: "packageUploadIds",
        localField: "packageUploadIds",
        foreignField: "_id",
        as: "uploads",
      },
    },
  ])) as Package[];

  return pkgRes[0] as Package | void;
}
