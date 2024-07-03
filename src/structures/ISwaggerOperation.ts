import { OpenApi } from "@samchon/openapi";
import { tags } from "typia";

import { ISwaggerSchema } from "./ISwaggerSchema";

export interface ISwaggerOperation extends OpenApi.IOperation<ISwaggerSchema> {
  "x-wrtn-icon"?: string & tags.Format<"uri">;
  "x-wrtn-standalone"?: boolean; // 단독 실행 가능 여부
}
export namespace ISwaggerOperation {
  export type Method = OpenApi.Method;
  export type IParameter = OpenApi.IOperation.IParameter<ISwaggerSchema>;
  export type IRequestBody = OpenApi.IOperation.IRequestBody<ISwaggerSchema>;
  export type IResponse = OpenApi.IOperation.IResponse<ISwaggerSchema>;
  export type IContent = OpenApi.IOperation.IContent<ISwaggerSchema>;
  export type IMediaType = OpenApi.IOperation.IMediaType<ISwaggerSchema>;
  export type ContentType = OpenApi.IOperation.ContentType;
}
