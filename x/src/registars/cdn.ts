import { Router, Status } from "../deps.ts";
import { fetchUpload } from "../utils/driver.ts";

export function cdnRegistar(router: Router) {
  // TODO: Do the CDN.
  router.get("/:fileName*.(ts|js)", async (ctx) => {
    const [moduleName, ...dirs] = ctx.params.fileName!.split("@");
    // TODO(@zorbyte): Find a way to actually pipe this into Conn.
    const upload = await fetchUpload(moduleName);
    if (!upload) return ctx.throw(Status.NotFound);
    const fileName = dirs.join("/");
    if (!Reflect.has(upload.fileMap, fileName)) {
      return ctx.throw(Status.NotFound);
    }

    const data = await fetch(upload.fileMap[fileName]);

    ctx.response.body = await data.text();
  });
}
