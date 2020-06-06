import {
  Package,
  getPackages,
  getPackage,
  fetchUser,
} from "../utils/driver.ts";
import { Router, Context, Status, nanoid } from "../deps.ts";
import { assertBody } from "../middleware/assertBody.ts";
import { BAD_REQ_PARAMS } from "../utils/errors.ts";

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

interface PublishRequest {
  name: string;
  update: boolean;
  version?: string;
}

interface OngoingPublish extends Required<PublishRequest> {
  token: string;
  apiKey: string;
  pieces: Record<string, string>;
}

// Upload Id, Data
const ongoingUploads = new Map<string, OngoingPublish>();

export function packageRegistar(router: Router) {
  router.get("/info", (ctx) => {
    ctx.response.body = JSON.stringify(STUB_PKG);
  });

  router.get("/packages", async (ctx) => {
    ctx.response.body = await getPackages(true);
  });

  router.post("/publish", assertBody, async (ctx: Context) => {
    const [bearer, apiKey] = ctx.request
      .headers.get("Authorisation")
      ?.split(" ") ?? ["", ""];

    if (bearer !== "Bearer") ctx.throw(Status.BadRequest);

    const user = await fetchUser(apiKey, true, true);

    if (!user) ctx.throw(Status.Unauthorized);

    const { body } = ctx.state as { body: PublishRequest };
    validPublishBody(ctx, body);

    const existingPkg = await getPackage(body.name, true);
    if (existingPkg.owner !== user._id) ctx.throw(Status.Forbidden);

    const version = body?.version ?? "0.0.1";

    if (
      (!body.update && existingPkg) ||
      body.update && existingPkg.uploads.some((p) => p._id === version)
    ) {
      ctx.throw(Status.Conflict);
    }

    const token = generatePublishToken();

    ongoingUploads.set(token, {
      token,
      apiKey,
      version,
      name: body.name,
      update: body.update,
      pieces: {},
    });
  });

  router.post("/piece", (ctx) => {});
}

function generatePublishToken(): string {
  const foundId = nanoid(8);
  if (ongoingUploads.has(foundId)) return generatePublishToken();
  return foundId;
}

function validPublishBody(ctx: Context, body: PublishRequest) {
  ctx.assert(Reflect.has(body, "name"), ...BAD_REQ_PARAMS);
  ctx.assert(
    Reflect.has(body, "update") && typeof body?.update === "boolean",
    ...BAD_REQ_PARAMS,
  );
}
