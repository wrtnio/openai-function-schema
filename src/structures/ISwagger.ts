import { OpenApi } from "@samchon/openapi";
import { tags } from "typia";

import { ISwaggerComponents } from "./ISwaggerComponents";
import { ISwaggerPath } from "./ISwaggerPath";

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
export interface ISwagger {
  /**
   * The version of the OpenAPI document.
   *
   * Nestia always generate OpenAPI 3.1.x document.
   */
  openapi: `3.1.${number}`;

  /**
   * List of servers that provide the API.
   */
  servers?: OpenApi.IServer[] & tags.MinItems<1>;

  /**
   * Information about the API.
   */
  info?: OpenApi.IDocument.IInfo;

  /**
   * The available paths and operations for the API.
   *
   * The 1st key is the path, and the 2nd key is the HTTP method.
   */
  paths?: Record<string, ISwaggerPath>;

  /**
   * An object to hold Webhooks.
   */
  webhooks?: Record<string, ISwaggerPath>;

  /**
   * An object to hold reusable data structures.
   *
   * It stores both DTO schemas and security schemes.
   *
   * For reference, `nestia` defines every object and alias types as reusable DTO
   * schemas. The alias type means that defined by `type` keyword in TypeScript.
   */
  components: ISwaggerComponents;

  /**
   * A declaration of which security mechanisms can be used across the API.
   *
   * When this property be configured, it would be overwritten in every API routes.
   *
   * For reference, key means the name of security scheme and value means the `scopes`.
   * The `scopes` can be used only when target security scheme is `oauth2` type,
   * especially for {@link ISwaggerSecurityScheme.IOAuth2.IFlow.scopes} property.
   */
  security?: Record<string, string[]>[];

  /**
   * List of tag names with description.
   *
   * It is possible to omit this property or skip some tag name even if
   * the tag name is used in the API routes. In that case, the tag name
   * would be displayed (in Swagger-UI) without description.
   */
  tags?: OpenApi.IDocument.ITag[];

  /**
   * Flag for indicating this document is emended by `@samchon/openapi`.
   */
  "x-samchon-emended": true;
}
