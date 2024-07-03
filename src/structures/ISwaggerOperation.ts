import { tags } from "typia";

import { ISwaggerSchema } from "./ISwaggerSchema";

export interface ISwaggerOperation {
  operationId?: string;
  parameters?: ISwaggerOperation.IParameter[];
  requestBody?: ISwaggerOperation.IRequestBody;
  responses?: Record<string, ISwaggerOperation.IResponse>;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  security?: Record<string, string[]>[];
  tags?: string[];
  "x-wrtn-icon"?: string & tags.Format<"uri">;
  "x-wrtn-standalone"?: boolean; // 단독 실행 가능 여부
}
export namespace ISwaggerOperation {
  export type Method =
    | "get"
    | "post"
    | "put"
    | "patch"
    | "delete"
    | "head"
    | "options"
    | "trace";

  export interface IParameter {
    name?: string;
    in: "path" | "query" | "header" | "cookie";
    schema: ISwaggerSchema;
    required?: boolean;
    title?: string;
    description?: string;
  }
  export interface IRequestBody {
    description?: string;
    required?: boolean;
    content?: IContent;
    "x-nestia-encrypted"?: boolean;
  }
  export interface IResponse {
    content?: IContent;
    headers?: Record<string, ISwaggerOperation.IParameter>;
    description?: string;
    "x-nestia-encrypted"?: boolean;
  }
  export type IContent = Partial<Record<ContentType, IMediaType>>;
  export interface IMediaType {
    schema?: ISwaggerSchema;
  }

  export type ContentType =
    | "text/plain"
    | "application/json"
    | "application/x-www-form-url-encoded"
    | "multipart/form-data"
    | "*/*"
    | (string & {});
}
