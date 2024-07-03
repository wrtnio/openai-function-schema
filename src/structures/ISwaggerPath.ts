import { OpenApi } from "@samchon/openapi";

import { ISwaggerOperation } from "./ISwaggerOperation";
import { ISwaggerSchema } from "./ISwaggerSchema";

export type ISwaggerPath = OpenApi.IPath<ISwaggerSchema, ISwaggerOperation>;
