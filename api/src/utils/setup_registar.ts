import { Router } from "../deps.ts";
import { $TSFIX } from "./types.d.ts";

export type RoutingRegistar = (router: Router) => void;

export function setupRegistar(router: Router, registar: RoutingRegistar): void;
export function setupRegistar(
  location: string,
  router: Router,
  registar: RoutingRegistar,
): void;
export function setupRegistar(
  location: string | Router,
  router: Router | RoutingRegistar,
  registar?: RoutingRegistar,
): void {
  // In the case that loc is router, the router argument must be a route registar.
  const isLocationRouter = location instanceof Router;
  const realRouter = (isLocationRouter ? location : router) as Router;
  const realRegistar = typeof router === "function" ? router : registar!;

  const subRouter = new Router();

  realRegistar(subRouter);

  // TODO(@zorbyte): Fix Types here.
  const routesArgs: $TSFIX[] = [subRouter.routes()];
  if (!isLocationRouter) routesArgs.unshift(location);

  const allowedMethodsArgs: $TSFIX[] = [subRouter.allowedMethods()];
  if (!isLocationRouter) routesArgs.unshift(location);

  realRouter.use(...routesArgs);
  realRouter.use(...allowedMethodsArgs);
}
