import { OpenApi, OpenApiV3_1 } from "@samchon/openapi";

import { ISwaggerOperation } from "./ISwaggerOperation";
import { ISwaggerSchema } from "./ISwaggerSchema";

/**
 * Swagger Document.
 *
 * `ISwagger` is based on {@link OpenApi.IDocument}, and it is a data structure
 * representing content of `swagger.json` file following OpenAPI v3.1 specification,
 * but emended a little bit by [`@samchon/openapi`](https://github.com/samchon/openapi).
 *
 * The difference with `ISwagger` and {@link OpenApi.IDocument} is that `ISwagger`
 * has more plugin properties especiallly for LLM (OpenAI) Function Calling. Below
 * is the plugin properties newly added to `ISwagger`:
 *
 * - {@link ISwaggerOperation.x-wrtn-icon}
 * - {@link ISwaggerSchema.IString.x-wrtn-secret-key}
 * - {@link ISwaggerSchema.IString.x-wrtn-secret-scopes}
 *
 * For reference, here is the entire list of difference between OpenAPI v3.1 and
 * emended {@link OpenApi.IDocument}.
 *
 * - Operation
 *   - Merged {@link OpenApiV3_1.IPath.parameters} to {@link OpenApi.IOperation.parameters}
 *   - Resolved {@link OpenApi.IJsonSchema.IReference references} of {@link OpenApiV3_1.IOperation} mebers
 * - JSON Schema
 *   - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
 *   - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
 *   - Array type utilizes only single {@link OpenAPI.IJsonSchema.IArray.items}
 *   - Tuple type utilizes only {@link OpenApi.IJsonSchema.ITuple.prefixItems}
 *   - Merge {@link OpenApiV3_1.IJsonSchema.IAnyOf} to {@link OpenApi.IJsonSchema.IOneOf}
 *   - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link OpenApi.IJsonSchema.IReference}
 *   - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link OpenApi.IJsonSchema.IObject}
 *
 * @author Samchon
 */
export type ISwagger = OpenApi.IDocument<ISwaggerSchema, ISwaggerOperation>;
