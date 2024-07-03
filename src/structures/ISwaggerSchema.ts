import { OpenApi } from "@samchon/openapi";

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
  export interface IConstant extends OpenApi.IJsonSchema.IConstant, __IPlugin {}
  export interface IBoolean extends OpenApi.IJsonSchema.IBoolean, __IPlugin {}
  export interface IInteger extends OpenApi.IJsonSchema.IInteger, __IPlugin {}
  export interface INumber extends OpenApi.IJsonSchema.INumber, __IPlugin {}
  export interface IString extends OpenApi.IJsonSchema.IString, __IPlugin {
    "x-wrtn-secret-key"?: string;
    "x-wrtn-secret-scopes"?: string[];
  }

  export interface IArray
    extends OpenApi.IJsonSchema.IArray<ISwaggerSchema>,
      __IPlugin {}
  export interface ITuple
    extends OpenApi.IJsonSchema.ITuple<ISwaggerSchema>,
      __IPlugin {}
  export interface IObject
    extends OpenApi.IJsonSchema.IObject<ISwaggerSchema>,
      __IPlugin {}
  export interface IReference<Key = string>
    extends OpenApi.IJsonSchema.IReference<Key>,
      __IPlugin {}
  export interface IOneOf
    extends OpenApi.IJsonSchema.IOneOf<ISwaggerSchema>,
      __IPlugin {}
  export interface INull extends OpenApi.IJsonSchema.INull, __IPlugin {}
  export interface IUnknown extends OpenApi.IJsonSchema.IUnknown, __IPlugin {}

  interface __IPlugin {
    "x-wrtn-placeholder"?: string;
    "x-wrtn-prerequisite"?: {
      method: "get" | "post" | "patch" | "put" | "delete";
      path: string;
      label: string;
      value: string;
      array?: string;
    };
  }
}
