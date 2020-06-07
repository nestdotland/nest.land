import { Package } from "./driver.ts";

export const STUB_PKG: Package = {
  _id: "cheese",
  owner: "nanny_mcphee_420",
  latestStableVersion: "1.0.0",
  latestVersion: "2.0.0-rc.1",
  description: "yummy",
  packageUploadIds: [],
  uploads: [
    {
      displayName: "cheese",
      _id: "1.0.0",
      description: "yummy",
      uploadedAt: new Date(),
      fileMap: {},
    },
  ],
};
