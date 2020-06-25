import { Joi, SchemaOptions } from "celebrate";
import { VALID_SEMVER_VER, BEARER_TOKEN } from "@lib/string_validator_util";

export interface Publish {
  name: string;
  description: string | null;
  documentation: string | null;
  version: string;
  latest: boolean;
  stable: boolean;
  upload: boolean;
  unlisted: boolean;
}

const strictBoolSchema = Joi.boolean().strict().required();
const packageNameSchema = Joi.string().min(2).max(40).required();

export const publishSchema: SchemaOptions = {
  headers: Joi.object()
    .keys({
      Authorization: Joi.string().required().regex(BEARER_TOKEN),
    })
    .unknown(),
  body: {
    name: packageNameSchema,
    description: Joi.string().default(null),
    documentation: Joi.string().default(null),
    version: Joi.string().regex(VALID_SEMVER_VER).default("0.0.1"),
    latest: strictBoolSchema,
    stable: strictBoolSchema,
    upload: strictBoolSchema,
    unlisted: strictBoolSchema,
  },
};

export const getPkgWithVerSchema: SchemaOptions = {
  params: {
    package: packageNameSchema,
    version: Joi.string().required().regex(VALID_SEMVER_VER),
  },
};
