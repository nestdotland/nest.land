import { Package, PackageUpload } from "./driver.ts";

export const UPLOADS_STUB: PackageUpload[] = [
  {
    _id: "cheese@1.0.0",
    version: "1.0.0",
    description: "yummy",
    uploadedAt: new Date(),
    fileMap: {},
  },
];

export const STUB_PKG: Package = {
  _id: "cheese",
  owner: "nanny_mcphee_420",
  latestStableVersion: "1.0.0",
  latestVersion: "2.0.0-rc.1",
  description: "yummy",
  packageUploadIds: ["cheese@1.0.0"],
  uploads: UPLOADS_STUB,
};
