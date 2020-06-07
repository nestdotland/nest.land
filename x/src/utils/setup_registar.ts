import { Router, Application } from "../deps.ts";
import { $TSFIX } from "./types.d.ts";

export type RouterRegistar = (router: Router) => void;

export function setupRegistar(
  application: Application,
  registar: RouterRegistar,
): void;
export function setupRegistar(
  location: string,
  application: Application,
  registar: RouterRegistar,
): void;
export function setupRegistar(
  location: string | Application,
  application: Application | RouterRegistar,
  registar?: RouterRegistar,
): void {
  // In the case that loc is router, the router argument must be a route registar.
  const isLocationApp = location instanceof Application;
  const app = (isLocationApp ? location : application) as Application;
  const realRegistar = typeof application === "function"
    ? application
    : registar!;

  const opts = !isLocationApp ? { prefix: location as string } : void 0;

  const subRouter = new Router(opts);

  realRegistar(subRouter);

  app.use(subRouter.routes());
  app.use(subRouter.allowedMethods());
}
