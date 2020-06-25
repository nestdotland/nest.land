import { Joi, SchemaOptions } from "celebrate";

export interface GenericAuth {
  username: string;
  password: string;
}

export interface NewPassword {
  username: string;
  password: string;
  newPassword: string;
}

export const usernameSchema = Joi.string().required().min(3).max(20);

export const genericAuthSchema: SchemaOptions = {
  body: {
    username: usernameSchema,
    password: Joi.string().required(),
  },
};

export const newPasswordSchema: SchemaOptions = {
  body: {
    ...genericAuthSchema.body,
    newPassword: Joi.string().required(),
  },
};
