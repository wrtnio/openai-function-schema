import { IOpenAiSchema } from "./IOpenAiSchema";
import { ISwaggerMigrateRoute } from "./ISwaggerMigrateRoute";
import { ISwaggerOperation } from "./ISwaggerOperation";

/**
 * OpenAI function metadata.
 *
 * `IOpenAiFunction` is a data structure representing a function,
 * which is provided by Restful API, and used for the OpenAI function call.
 *
 * If you provide this `IOpenAiFunction` instance to the OpenAI, the OpenAI
 * will construct arguments by conversating with the user. Also, you can
 * execute the function call with the OpenAI constructed arguments by using
 * {@link OpenAiFetcher.execute}.
 *
 * For reference, different between `IOpenAiFunction` and its origin source
 * {@link ISwaggerOperation} is, `IOpenAiFunction` has converted every type schema
 * informations from {@link ISwaggerSchema} to {@link IOpenAiSchema} to escape
 * {@link ISwaggerSchema.IReference reference types}, and downgrade the version of
 * the JSON schema to OpenAPI 3.0. It's because OpenAI function call feature cannot
 * understand both reference types and OpenAPI 3.1 specification.
 *
 * Additionally, if you've composed `IOpenAiFunction` with
 * {@link IOpenAiDocument.IOptions.keyword} configuration (as `true`), number of
 * {@link IOpenAiFunction.parameters} are always 1 and the first parameter's type is
 * always {@link IOpenAiSchema.IObject}. The properties' rule is:
 *
 * - `pathParameters`: Path parameters of {@link ISwaggerMigrateRoute.parameters}
 * - `query`: Query parameter of {@link ISwaggerMigrateRoute.query}
 * - `body`: Body parameter of {@link ISwaggerMigrateRoute.body}
 *
 * ```typescript
 * {
 *   ...pathParameters,
 *   query,
 *   body,
 * }
 * ```
 *
 * Otherwise, the parameters would be multiple, and the sequence of the parameters
 * are following below rules:
 *
 * ```typescript
 * [
 *   ...pathParameters,
 *   ...(query ? [query] : []),
 *   ...(body ? [body] : []),
 * ]
 * ```
 *
 * @reference https://platform.openai.com/docs/guides/function-calling
 * @author Samchon
 */
export interface IOpenAiFunction {
  /**
   * HTTP method of the endpoint.
   */
  method: "get" | "post" | "patch" | "put" | "delete";

  /**
   * Path of the endpoint.
   */
  path: string;

  /**
   * Representative name of the function.
   *
   * The `name` is a repsentative name identifying the function in the
   * {@link IOpenAiDocument}. The `name` value is just composed by joining the
   * {@link IMigrateRoute.accessor} by underscore `_` character.
   *
   * Here is the composition rule of the  {@link IMigrateRoute.accessor}:
   *
   * > The `accessor` is composed with the following rules. At first, namespaces
   * > are composed by static directory names in the {@link path}. Parametric
   * > symbols represented by `:param` or `{param}` cannot be a part of the
   * > namespace.
   * >
   * > Instead, they would be a part of the function name. The function
   * > name is composed with the {@link method HTTP method} and parametric symbols
   * > like `getByParam` or `postByParam`. If there are multiple path parameters,
   * > they would be concatenated by `And` like `getByParam1AndParam2`.
   * >
   * > For refefence, if the {@link operation}'s {@link method} is `delete`, the
   * > function name would be replaced to `erase` instead of `delete`. It is
   * > the reason why the `delete` is a reserved keyword in many programming
   * > languages.
   * >
   * > - Example 1
   * >   - path: `POST /shopping/sellers/sales`
   * >   - accessor: `shopping.sellers.sales.post`
   * > - Example 2
   * >   - endpoint: `GET /shoppings/sellers/sales/:saleId/reviews/:reviewId/comments/:id
   * >   - accessor: `shoppings.sellers.sales.reviews.getBySaleIdAndReviewIdAndCommentId`
   */
  name: string;

  /**
   * Whether the function schema types are strict or not.
   *
   * Newly added specification at 2024-08-07.
   *
   * @reference https://openai.com/index/introducing-structured-outputs-in-the-api/
   */
  strict: true;

  /**
   * List of parameter schemas.
   *
   * If you've configured {@link IOpenAiDocument.IOptions.keyword} (as `true`),
   * number of {@link IOpenAiFunction.parameters} are always 1 and the first parameter's
   * type is always {@link IOpenAiSchema.IObject}. The properties' rule is:
   *
   * - `pathParameters`: Path parameters of {@link IMigrateRoute.parameters}
   * - `query`: Query parameter of {@link IMigrateRoute.query}
   * - `body`: Body parameter of {@link IMigrateRoute.body}
   *
   * ```typescript
   * {
   *   ...pathParameters,
   *   query,
   *   body,
   * }
   * ```
   *
   * Otherwise, the parameters would be multiple, and the sequence of the parameters
   * are following below rules:
   *
   * ```typescript
   * [
   *   ...pathParameters,
   *   ...(query ? [query] : []),
   *   ...(body ? [body] : []),
   * ]
   * ```
   */
  parameters: IOpenAiSchema[];

  /**
   * Collection of separated parameters.
   *
   * Filled only when {@link IOpenAiDocument.IOptions.separate} has been configured.
   */
  separated?: IOpenAiFunction.ISeparated;

  /**
   * Expected return type.
   *
   * If the function returns nothing (`void`), then the output is `undefined`.
   */
  output?: IOpenAiSchema | undefined;

  /**
   * Description of the function.
   *
   * Composed by such rule:
   *
   * 1. Starts from the {@link OpenApi.IOperation.summary} paragraph.
   * 2. The next paragraphs are filled with the {@link OpenApi.IOperation.description}.
   *    By the way, if the first paragraph of {@link OpenApi.IOperation.description} is same
   *    with the {@link OpenApi.IOperation.summary}, it would not be duplicated.
   * 3. Parameters' descriptions are added with `@param` tag.
   * 4. {@link OpenApi.IOperation.security Security requirements} are added with `@security` tag.
   * 5. Tag names are added with `@tag` tag.
   * 6. If {@link OpenApi.IOperation.deprecated}, `@deprecated` tag is added.
   */
  description?: string;

  /**
   * Get the Swagger operation metadata.
   *
   * Get the Swagger operation metadata, of the source.
   *
   * @returns Swagger operation metadata.
   */
  operation: () => ISwaggerOperation;

  /**
   * Get the migration route metadata.
   *
   * Get the migration route metadata, of the source.
   *
   * @returns Migration route metadata.
   */
  route: () => ISwaggerMigrateRoute;
}
export namespace IOpenAiFunction {
  /**
   * Collection of separated parameters.
   */
  export interface ISeparated {
    /**
     * Parameters that would be composed by the OpenAI.
     */
    llm: ISeparatedParameter[];

    /**
     * Parameters that would be composed by the human.
     */
    human: ISeparatedParameter[];
  }

  /**
   * Separated parameter.
   */
  export interface ISeparatedParameter {
    /**
     * Index of the parameter.
     */
    index: number;

    /**
     * Type schema info of the parameter.
     */
    schema: IOpenAiSchema;
  }
}
