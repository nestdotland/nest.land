import { Status } from "../deps.ts";

type ErrorArgs = [number, string];

export const BAD_REQ_PARAMS: ErrorArgs = [
  Status.BadRequest,
  '{"status":400,"message":"Bad Request"}',
];
