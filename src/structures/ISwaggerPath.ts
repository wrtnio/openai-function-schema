import { OpenApi } from "@samchon/openapi";

import { ISwaggerOperation } from "./ISwaggerOperation";
import { ISwaggerSchema } from "./ISwaggerSchema";

/**
 * Path item.
 *
 * `ISwaggerPath` represents a path item of emended OpenAPI v3.1,
 * collecting multiple method operations in a single path.
 *
 * @author Samchon
 */
export type ISwaggerPath = OpenApi.IPath<ISwaggerSchema, ISwaggerOperation>;
