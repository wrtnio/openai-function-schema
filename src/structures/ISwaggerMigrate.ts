import { IMigrateDocument } from "@samchon/openapi";

import { ISwaggerOperation } from "./ISwaggerOperation";
import { ISwaggerSchema } from "./ISwaggerSchema";

export type ISwaggerMigrate = IMigrateDocument<
  ISwaggerSchema,
  ISwaggerOperation
>;
export namespace ISwaggerMigrate {
  export type IError = IMigrateDocument.IError<ISwaggerSchema>;
}
