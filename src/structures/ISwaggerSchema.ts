import { tags } from "typia";

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
  export interface IConstant extends __IAttribute {
    const: boolean | number | string;
  }
  export interface IBoolean extends __ISignificant<"boolean"> {
    default?: boolean;
  }
  export interface IInteger extends __ISignificant<"integer"> {
    default?: number & tags.Type<"int64">;
    minimum?: number & tags.Type<"int64">;
    maximum?: number & tags.Type<"int64">;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    multipleOf?: number & tags.Type<"uint64"> & tags.ExclusiveMinimum<0>;
  }
  export interface INumber extends __ISignificant<"number"> {
    default?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    multipleOf?: number & tags.ExclusiveMinimum<0>;
  }
  export interface IString extends __ISignificant<"string"> {
    contentMediaType?: string;
    default?: string;
    format?:
      | "binary"
      | "byte"
      | "password"
      | "regex"
      | "uuid"
      | "email"
      | "hostname"
      | "idn-email"
      | "idn-hostname"
      | "iri"
      | "iri-reference"
      | "ipv4"
      | "ipv6"
      | "uri"
      | "uri-reference"
      | "uri-template"
      | "url"
      | "date-time"
      | "date"
      | "time"
      | "duration"
      | "json-pointer"
      | "relative-json-pointer"
      | (string & {});
    pattern?: string;
    minLength?: number & tags.Type<"uint64">;
    maxLength?: number & tags.Type<"uint64">;
    "x-wrtn-secret-key"?: string;
    "x-wrtn-secret-scopes"?: string[];
  }

  export interface IArray extends __ISignificant<"array"> {
    items: ISwaggerSchema;
    minItems?: number & tags.Type<"uint64">;
    maxItems?: number & tags.Type<"uint64">;
    uniqueItems?: boolean;
  }
  export interface ITuple extends __ISignificant<"array"> {
    prefixItems: ISwaggerSchema[];
    additionalItems?: boolean | ISwaggerSchema;
    minItems?: number & tags.Type<"uint64">;
    maxItems?: number & tags.Type<"uint64">;
    uniqueItems?: boolean;
  }
  export interface IObject extends __ISignificant<"object"> {
    properties?: Record<string, ISwaggerSchema>;
    additionalProperties?: boolean | ISwaggerSchema;
    required?: string[];
  }
  export interface IReference<Key = string> extends __IAttribute {
    $ref: Key;
  }

  export interface IOneOf extends __IAttribute {
    oneOf: Exclude<ISwaggerSchema, ISwaggerSchema.IOneOf>[];
  }
  export interface INull extends __ISignificant<"null"> {}
  export interface IUnknown extends __IAttribute {
    type?: undefined;
  }

  interface __ISignificant<Type extends string> extends __IAttribute {
    type: Type;
  }
  interface __IAttribute {
    title?: string;
    description?: string;
    deprecated?: boolean;
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
