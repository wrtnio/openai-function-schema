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
  export interface IOneOf
    extends OpenApi.IJsonSchema.IOneOf<ISwaggerSchema>,
      __IPlugin {}

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
       * Transform function returning label.
       *
       * `Prerequisite.Props.label` is a string typed property representing
       * a function returning the label from the element instance of the
       * prerequisite API respond array.
       *
       * The function script must be a string value that can be parsed by
       * `new Function(string)` statement. Also, its parameter names are
       * always `elem`, `index` and `array`. Of course, the function's
       * return type must be always `string`.
       *
       * - type: `label: (elem: Element, index: number, array: Element[]) => string`
       * - example: `return elem.title`
       * - how to use: `new Function("elem", "index", "array", labelScript)(...)`
       */
      label: string;

      /**
       * Transform function returning target value.
       *
       * `Prerequisite.Props.value` is a string typed property representing
       * a function returning the target value from the element instance of
       * the prerequisite API respond array. If you've defined this `Prerequisite`
       * type to a `number` type, the returned value must be actual number type.
       *
       * The function script must be a string value that can be parsed by
       * `new Function(string)` statement. Also, its parameter names are always
       * `elem`, `index` and `array`.
       *
       * - type: `value: (elem: Element, index: number, array: Element[]) => Value`
       * - example: `return elem.no`
       * - how to use: `new Function("elem", "index", "array", valueScript)(...)`
       */
      value: string;

      /**
       * Transform function returning array instance.
       *
       * `Prerequisite.Props.array` is a string typed property representing
       * a function returning an array instance from the response of the
       * prerequisite API.
       *
       * The function script must be a string value that can be parsed by
       * `new Function(string)` statement. Also, its parameter name is
       * always `response`.
       *
       * If the prerequisite API responses an array and it is the desired one,
       * you don't need to specify this property.
       *
       * - type: `array: (response: Response) => Elemenet[]`
       * - example: `return response.members.map(m => m.data)`
       * - how to use: `new Function("response", arrayScript)(response)`
       */
      array?: string;
    };
  }
}
