import { BAD_REQ_PARAMS } from "./errors.ts";
import { Context } from "../deps.ts";

export type TypeOfTypes =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

export function assertFields<T extends Record<any, any>>(
  ctx: Context,
  body: T,
  validations: { [P in keyof T]: TypeOfTypes },
) {
  for (const [key, typeToCheck] of Object.entries(validations)) {
    ctx.assert(
      Reflect.has(body, key) && typeof body[key] === typeToCheck,
      ...BAD_REQ_PARAMS,
    );
  }
}
