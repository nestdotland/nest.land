import { Package, getPackages } from "../utils/driver.ts";
import { Router } from "../deps.ts";

const STUB_PKG: Package = {
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

// package is a reserved words with esmodules.
export function package_(router: Router) {
  router.get("/info", (ctx) => {
    ctx.response.body = JSON.stringify(STUB_PKG);
  });

  router.get("/packages", async (ctx) => {
    ctx.response.body = await getPackages(true);
  });
}
