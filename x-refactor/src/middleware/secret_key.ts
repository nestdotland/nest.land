import { XConfig } from "@lib/config";

import { Request, Response, NextFunction } from "express";

// NOTE: This currently is not in use.
export function secretKeyVerification(config: XConfig) {
  return config.secretKey
    ? verifyKey
    : (_req: Request, _res: Response, next: NextFunction) => next();

  function verifyKey(req: Request, res: Response, next: NextFunction) {
    if (!req.headers["x-secret-salt"] || !req.headers["x-secret-hash"]) {
      return res.sendStatus(401);
    }

    const serverHash = config
      .secretKey!.update(req.headers["x-secret-salt"].toString())
      .digest("hex");

    if (serverHash !== req.headers["x-secret-hash"]) {
      return res.sendStatus(401);
    }

    next();
  }
}
