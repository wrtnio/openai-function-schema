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
