import { OpenApi } from "@samchon/openapi";
import { tags } from "typia";

import { ISwaggerSchema } from "./ISwaggerSchema";

/**
 * Remote operation info.
 *
 * `ISwaggerOperation` represents an Restful API operation provided by the
 * remote server.
 *
 * @author Samchon
 */
export interface ISwaggerOperation extends OpenApi.IOperation<ISwaggerSchema> {
  /**
   * Icon URL.
   *
   * `x-wrtn-icon` is a property means an icon URL representing the target API.
   */
  "x-wrtn-icon"?: string & tags.Format<"uri">;

  /**
   * Whether standalone API or not.
   *
   * `x-wrtn-standalone` is a property means whether the target API is standalone
   * so that it can be called without any other APIs or not.
   */
  "x-wrtn-standalone"?: boolean;
}
export namespace ISwaggerOperation {
  /**
   * Method of the operation.
   */
  export type Method = OpenApi.Method;

  /**
   * Parameter of the operation.
   */
  export type IParameter = OpenApi.IOperation.IParameter<ISwaggerSchema>;

  /**
   * Request body of the operation.
   */
  export type IRequestBody = OpenApi.IOperation.IRequestBody<ISwaggerSchema>;

  /**
   * Response of the operation.
   */
  export type IResponse = OpenApi.IOperation.IResponse<ISwaggerSchema>;

  /**
   * List of content types supported in request/response body.
   */
  export type IContent = OpenApi.IOperation.IContent<ISwaggerSchema>;

  /**
   * Media type of a request/response body.
   */
  export type IMediaType = OpenApi.IOperation.IMediaType<ISwaggerSchema>;

  /**
   * List of supported content media types.
   */
  export type ContentType = OpenApi.IOperation.ContentType;
}
