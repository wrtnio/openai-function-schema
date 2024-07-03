import { IMigrateRoute } from "@samchon/openapi";

import { ISwaggerOperation } from "./ISwaggerOperation";
import { ISwaggerSchema } from "./ISwaggerSchema";

export type ISwaggerMigrateRoute = IMigrateRoute<
  ISwaggerSchema,
  ISwaggerOperation
>;
export namespace ISwaggerMigrateRoute {
  export type IParameter = IMigrateRoute.IParameter<ISwaggerSchema>;
  export type IHeaders = IMigrateRoute.IHeaders<ISwaggerSchema>;
  export type IQuery = IMigrateRoute.IQuery<ISwaggerSchema>;
  export type IBody = IMigrateRoute.IBody<ISwaggerSchema>;
  export type IException = IMigrateRoute.IException<ISwaggerSchema>;
}
