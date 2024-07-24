import { OpenApi } from "@samchon/openapi";

/**
 * Type schema info.
 *
 * `ISwaggerSchema` is a type schema info of the OpenAPI v3.1 specification,
 * but a little shrinked and removed ambiguous and duplicated expressions of
 * OpenAPI v3.1 fopr the convenience and clarity.
 *
 * - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
 * - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
 * - Array type utilizes only single {@link OpenAPI.IJsonSchema.IArray.items}
 * - Tuple type utilizes only {@link OpenApi.IJsonSchema.ITuple.prefixItems}
 * - Merge {@link OpenApiV3_1.IJsonSchema.IAnyOf} to {@link OpenApi.IJsonSchema.IOneOf}
 * - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link OpenApi.IJsonSchema.IReference}
 * - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link OpenApi.IJsonSchema.IObject}
 *
 * Also, `ISwaggerSchema` extended some plugin properties for LLM
 * (Large Language Model, OpenAI) function calling purpose. Below is the list of
 * plugin properties newly added from {@link OpenApi.IJsonSchema} to `ISwaggerSchema`.
 *
 * - {@link ISwaggerSchema.IString.x-wrtn-secret-key}
 * - {@link ISwaggerSchema.IString.x-wrtn-secret-scopes}
 * - {@link ISwaggerSchema.__IPlugin.x-wrtn-placeholder}
 * - {@link ISwaggerSchema.__IPlugin.x-wrtn-prerequisite}
 *
 * @author Samchon
 */
export type ISwaggerSchema =
  | ISwaggerSchema.IConstant
  | ISwaggerSchema.IBoolean
  | ISwaggerSchema.IInteger
  | ISwaggerSchema.INumber
  | ISwaggerSchema.IString
  | ISwaggerSchema.IArray
  | ISwaggerSchema.ITuple
  | ISwaggerSchema.IObject
  | ISwaggerSchema.IReference
  | ISwaggerSchema.IOneOf
  | ISwaggerSchema.INull
  | ISwaggerSchema.IUnknown;
export namespace ISwaggerSchema {
  /**
   * Constant value type.
   */
  export interface IConstant extends OpenApi.IJsonSchema.IConstant, __IPlugin {}

  /**
   * Boolean type info.
   */
  export interface IBoolean extends OpenApi.IJsonSchema.IBoolean, __IPlugin {}

  /**
   * Integer type info.
   */
  export interface IInteger extends OpenApi.IJsonSchema.IInteger, __IPlugin {}

  /**
   * Number (double) type info.
   */
  export interface INumber extends OpenApi.IJsonSchema.INumber, __IPlugin {}

  /**
   * String type info.
   */
  export interface IString extends OpenApi.IJsonSchema.IString, __IPlugin {
    /**
     * Secret key for the schema.
     *
     * `x-wrtn-secret-key` is a property means a secret key that is required
     * for the target API endpoint calling. If the secret key is not filled,
     * the API call would be failed.
     */
    "x-wrtn-secret-key"?: string;

    /**
     * Secret scopes for the schema.
     *
     * `x-wrtn-secret-scopes` is a property means a list of secret scopes that
     * are required for the target API endpoint calling. If the secret scopes
     * are not satisfied, the API call would be failed.
     */
    "x-wrtn-secret-scopes"?: string[];
  }

  /**
   * Array type info.
   */
  export interface IArray
    extends OpenApi.IJsonSchema.IArray<ISwaggerSchema>,
      __IPlugin {}

  /**
   * Tuple type info.
   */
  export interface ITuple
    extends OpenApi.IJsonSchema.ITuple<ISwaggerSchema>,
      __IPlugin {}

  /**
   * Object type info.
   */
  export interface IObject
    extends OpenApi.IJsonSchema.IObject<ISwaggerSchema>,
      __IPlugin {}

  /**
   * Reference type directing named schema.
   */
  export interface IReference<Key = string>
    extends OpenApi.IJsonSchema.IReference<Key>,
      __IPlugin {}

  /**
   * Union type.
   *
   * IOneOf` represents an union type of the TypeScript (`A | B | C`).
   *
   * For reference, even though your Swagger (or OpenAPI) document has
   * defined `anyOf` instead of the `oneOf`, {@link OpenApi} forcibly
   * converts it to `oneOf` type.
   */
  export interface IOneOf extends OpenApi.IJsonSchema.__IAttribute, __IPlugin {
    /**
     * List of the union types.
     */
    oneOf: Exclude<ISwaggerSchema, ISwaggerSchema.IOneOf>[];
  }

  /**
   * Null type.
   */
  export interface INull extends OpenApi.IJsonSchema.INull, __IPlugin {}

  /**
   * Unknown, `any` type.
   */
  export interface IUnknown extends OpenApi.IJsonSchema.IUnknown, __IPlugin {}

  /**
   * Plugin properties for every types.
   */
  interface __IPlugin {
    /**
     * Placeholder value for frontend application.
     *
     * Placeholder means the value to be shown in the input field as a hint.
     * For example, when an email input field exists, the placeholder value
     * would be "Insert your email address here".
     */
    "x-wrtn-placeholder"?: string;

    /**
     * Prerequisite API endpoint for the schema.
     *
     * `x-wrtn-prerequisite` is a property representing the prerequisite API
     * interaction. It means that, the endpoint API should be called before
     * calling the target API, for composing some argument value.
     *
     * @reference https://github.com/wrtnio/decorators/blob/main/src/Prerequisite.ts
     */
    "x-wrtn-prerequisite"?: {
      /**
       * HTTP method to call the endpoint.
       */
      method: "get" | "post" | "patch" | "put" | "delete";

      /**
       * Path of the endpoint.
       */
      path: string;

      /**
       * Function returning transformed values using JMESPath expression.
       *
       * `Prerequisite.Props.jmesPath` is a string typed property that extracts desired values
       * from the prerequisite API response using a JMESPath expression. This property simplifies
       * and replaces the `label`, `value`, and `array` properties.
       *
       * JMESPath expressions are used to extract the desired data based on the API response.
       * The expression must always be a valid JMESPath syntax.
       *
       * - Type: `jmesPath: string`
       * - Example: `"members[*].data.title"`
       * - Usage: `jmespath.search(response, jmesPath)`
       *
       * Note: The `label`, `value`, and `array` properties are no longer in use.
       */
      jmesPath: string;
    };
  }
}
