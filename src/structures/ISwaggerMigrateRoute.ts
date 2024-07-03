import { ISwaggerOperation } from "./ISwaggerOperation";
import { ISwaggerSchema } from "./ISwaggerSchema";

export interface ISwaggerMigrateRoute {
  /**
   * Method of the route.
   *
   * If the {@link ISwaggerOperation.method} is not one of below type
   * values, the operation would be ignored in the migration process for
   * the RPC (Remote Procedure Call) function.
   */
  method: "head" | "get" | "post" | "put" | "patch" | "delete";

  /**
   * Original path from the OpenAPI document.
   */
  path: string;

  /**
   * Emended path for OpenAPI generator libraries.
   *
   * The difference between {@link path} is:
   *
   * 1. Path parameters are replaced with `:param` format.
   * 2. Empty sub-paths are removed.
   * 3. Do not starts with `/`.
   */
  emendedPath: string;

  /**
   * Accessor for the route.
   *
   * The `accessor` is a list of string values that are representing how to
   * access to the OpenAPI generated RPC (Remote Procedure Call) function
   * through namespace(s).
   *
   * The `accessor` is composed with the following rules. At first, namespaces
   * are composed by static directory names in the {@link path}. Parametric
   * symbols represented by `:param` or `{param}` cannot be a part of the
   * namespace.
   *
   * Instead, they would be a part of the function name. The function
   * name is composed with the {@link method HTTP method} and parametric symbols
   * like `getByParam` or `postByParam`. If there are multiple path parameters,
   * they would be concatenated by `And` like `getByParam1AndParam2`.
   *
   * For refefence, if the {@link operation}'s {@link method} is `delete`, the
   * function name would be replaced to `erase` instead of `delete`. It is
   * the reason why the `delete` is a reserved keyword in many programming
   * languages.
   *
   * - Example 1
   *   - path: `POST /shopping/sellers/sales`
   *   - accessor: `shopping.sellers.sales.post`
   * - Example 2
   *   - endpoint: `GET /shoppings/sellers/sales/:saleId/reviews/:reviewId/comments/:id
   *   - accessor: `shoppings.sellers.sales.reviews.getBySaleIdAndReviewIdAndCommentId`
   */
  accessor: string[];

  /**
   * List of path parameters.
   */
  parameters: ISwaggerMigrateRoute.IParameter[];

  /**
   * Metadata of headers.
   *
   * The `headers` property is a metadata of HTTP request headers for RPC function,
   * including the parameter variable name and schema.
   *
   * Also, its {@link IMigrateRoute.IHeaders.schema} is always object or reference
   * to object. Even though the original {@link OpenApi.IOperation OpenAPI operation}'s
   * headers are separated to atomic typed properties, the `headers` property forcibly
   * combines them into a single object type.
   *
   * For reference, if the `headers` property has been converted to an object type
   * forcibly, its property {@link IMigrateRoute.IHeaders.name name} and
   * {@link IMigrateRoute.IHeaders.key key} are always "headers".
   */
  headers: ISwaggerMigrateRoute.IHeaders | null;

  /**
   * Metadata of query values.
   *
   * The `query` property is a metadata of HTTP request query values for RPC function,
   * including the parameter variable name and schema.
   *
   * Also, its {@link IMigrateRoute.IQuery.schema} is always object or reference
   * to object. Even though the original {@link OpenApi.IOperation OpenAPI operation}'s
   * query parameters are separated to atomic typed properties, the `query` property
   * forcibly combines them into a single object type.
   *
   * For reference, if the `query` property has been converted to an object type
   * forcibly, its property {@link IMigrateRoute.IQuery.name name} and
   * {@link IMigrateRoute.IQuery.key key} are always "headers".
   */
  query: ISwaggerMigrateRoute.IQuery | null;

  /**
   * Metadata of request body.
   *
   * The `body` property is a metadata of HTTP request body for RPC function,
   * including the parameter variable name, content type, and schema.
   *
   * If the `body` property is `null`, it means the operation does not require
   * the request body data.
   */
  body: ISwaggerMigrateRoute.IBody | null;

  success: ISwaggerMigrateRoute.IBody | null; // 200 or 201 status case
  exceptions: Record<string, ISwaggerMigrateRoute.IException>; // other status cases
  comment: () => string;
  operation: () => ISwaggerOperation;
}
export namespace ISwaggerMigrateRoute {
  export interface IParameter {
    name: string;
    key: string;
    schema: ISwaggerSchema;
    description?: string;
  }
  export interface IHeaders {
    name: string; // headers
    key: string; // headers
    schema: ISwaggerSchema.IObject | ISwaggerSchema.IReference;
  }
  export interface IQuery {
    name: string;
    key: string;
    schema: ISwaggerSchema.IObject | ISwaggerSchema.IReference;
  }
  export interface IBody {
    name: string;
    key: string;
    type:
      | "text/plain"
      | "application/json"
      | "application/x-www-form-urlencoded"
      | "multipart/form-data";
    schema: ISwaggerSchema;
    "x-nestia-encrypted"?: boolean;
  }
  export interface IException {
    description?: string;
    schema: ISwaggerSchema;
  }
}
