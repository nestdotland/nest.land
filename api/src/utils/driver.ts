import { MongoClient } from "../deps.ts";

export const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

export const db = client.database("nest-land");

export const users = db.collection("users");
export const packages = db.collection("packages");
export const packageUploads = db.collection("packageUploads");

export interface PackageUpload {
  // _id is the version.
  _id: string;
  displayName: string;
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

export async function createUser(user: User) {
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

export async function createUpload(pkg: Package | string) {
  throw new Error("Not implemented!");

  // @ts-ignore
  const _id = typeof pkg !== "string" ? pkg._id : pkg;

  const exists = !!(await packages.count({ _id }));
  if (!!exists) throw new Error("Invalid package.");

  const upload: PackageUpload = {
    uploadedAt: new Date(),
  } as any;

  packageUploads.insertOne(upload);
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

  const pkgRes = await packages.aggregate([
    { $match: { _id } },
    {
      $lookup: {
        from: "packageUploadIds",
        localField: "packageUploadIds",
        foreignField: "_id",
        as: "uploads",
      },
    },
  ]) as Package[];

  return pkgRes[0] as Package | void ;
}
