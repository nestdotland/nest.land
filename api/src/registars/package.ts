import { Router, Context, Status, nanoid } from "../deps.ts";
import { getPackages, getPackage, createUpload } from "../utils/driver.ts";

import { assertBody } from "../middleware/assert_body.ts";
import { ensureMaxPayload } from "../middleware/max_payload.ts";

import { assertFields } from "../utils/assert_fields.ts";
import { getUserWithApiKey } from "../utils/auth.ts";
import { LOCAL_URI } from "../utils/arweave_api.ts";

// TODO(@zorbyte): Rename these from *Request to *Payload.
interface PublishRequest {
  name: string;
  update: boolean;
  description: string;
  version: string;
}

// TODO: Implement this for the /piece route.
interface PieceRequest {
  token: string;
  pieces: Record<string, string>;
  end: boolean;
}

interface PackageInfoRequest {
  getUploads: boolean;
}

interface OngoingPublish extends Required<PublishRequest> {
  token: string;
  ownerId: string;
  apiKey: string;
  pieces: Record<string, string>;
}

// Upload Id, Data
const ongoingUploads = new Map<string, OngoingPublish>();

// TODO(@zorbyte): There is a lot of repeated code, lots of it should be turned into middleware and state.
export function packageRegistar(router: Router) {
  router.get("/info/:packageName", assertBody, async ctx => {
    const { body } = ctx.state as { body: PackageInfoRequest };
    assertFields(ctx, body, {
      getUploads: "boolean",
    });

    // TODO(@zorbyte): This shouldn't be required,
    // but for now I'm going to check for it to save time while testing.
    if (!ctx.params.packageName) return ctx.throw(Status.BadRequest);

    const pkg = await getPackage(ctx.params.packageName, body.getUploads);
    if (!pkg) return ctx.throw(Status.NotFound);

    ctx.response.body = pkg;
  });

  router.get("/packages", async ctx => {
    ctx.response.body = await getPackages(true);
  });

  router.post("/publish", assertBody, async ctx => {
    const [user, apiKey] = await getUserWithApiKey(ctx);
    if (!apiKey) return ctx.throw(Status.BadRequest);
    if (!user) return ctx.throw(Status.Unauthorized);

    const { body } = ctx.state as { body: PublishRequest };
    assertFields(ctx, body, {
      name: "string",
      update: "boolean",
      description: "string",
      version: "string",
    });

    const existingPkg = await getPackage(body.name, true);
    const version = body?.version ?? "0.0.1";

    if (existingPkg && body.update) {
      if (existingPkg.owner !== user._id) ctx.throw(Status.Forbidden);

      if (existingPkg.uploads.some(p => p._id === version)) {
        ctx.throw(Status.Conflict);
      }
    }

    const token = generatePublishToken();

    ongoingUploads.set(token, {
      token,
      apiKey,
      description: body.description,
      ownerId: user._id,
      version,
      name: body.name,
      update: body.update,
      pieces: {},
    });
  });

  // Upload pieces of the packet,
  // this should enforce maximum payload limits as well as prevent the server from being blocked.
  router.post("/piece", assertBody, ensureMaxPayload, async ctx => {
    const [user, apiKey] = await getUserWithApiKey(ctx);
    if (!apiKey) return ctx.throw(Status.BadRequest);
    if (!user) return ctx.throw(Status.Unauthorized);

    const { body } = ctx.state as { body: PieceRequest };
    assertFields(ctx, body, {
      token: "string",
      pieces: "object",
      end: "boolean",
    });

    const upload = ongoingUploads.get(body.token);
    if (!upload) return ctx.throw(Status.NotFound);

    if (upload.apiKey !== apiKey) return ctx.throw(Status.Unauthorized);

    upload.pieces = {
      ...upload.pieces,
      ...body.pieces,
    };

    ongoingUploads.set(body.token, upload);

    // TODO: Make it run uploads on each piece rather than the end.
    // Also consider making it run in the background, and making an endpoint where the CLI can check if it succeeded.
    if (body.end) {
      ongoingUploads.delete(body.token);
      const fileMap = Object.fromEntries(
        await Promise.all(
          Object.entries(upload.pieces).map(async ([key, value]) => {
            const res = await fetch(LOCAL_URI, {
              body: value,
              method: "POST",
            });

            return [key, await res.text()];
          }),
        ),
      );

      await createUpload(upload.name, upload.update, upload.ownerId, {
        version: upload.version,
        displayName: upload.name,
        description: upload.description,
        fileMap,
      });
    }
  });
}

function generatePublishToken(): string {
  // Probably worth using some sort of counter, this is 8 iterations that could be optimised
  // In reality, if we use a counter, we would only need to use the amount of iterations
  // for how many existing entries there are. This may outgrow the performance penalty of 8 iterations though.
  const foundId = nanoid(8);
  if (ongoingUploads.has(foundId)) return generatePublishToken();
  return foundId;
}
