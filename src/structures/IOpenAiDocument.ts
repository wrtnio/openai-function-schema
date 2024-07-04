import { IOpenAiFunction } from "./IOpenAiFunction";
import { IOpenAiSchema } from "./IOpenAiSchema";
import { ISwaggerMigrateRoute } from "./ISwaggerMigrateRoute";
import { ISwaggerOperation } from "./ISwaggerOperation";

/**
 * Document of OpenAI function call metadata.
 *
 * `IOpenAiDocument` is a data structure representing content of
 * {@link IOpenAiDocument.functions OpenAI function call metadata}, composed by
 * {@link OpenAiComposer} from the {@link ISwagger} document, with
 * {@link IOpenAiDocument.errors} and adjusted {@link IOpenAiDocument.options}.
 *
 * The different between `IOpenAiDocument` and its origin source {@link ISwagger}
 * is, `IOpenAiDocument` has converted every {@link ISwaggerOperation API endpoints}
 * to {@link IOpenAiFunction function metadata}. You can execute the function call
 * with OpenAI constructed arguments by using the {@link OpenAiFetcher.execute}
 * function with the function metadata.
 *
 * Also, every type schema informations are casted from {@link ISwaggerSchema} to
 * {@link IOpenAiSchema} to escape {@link ISwaggerSchema.IReference reference types},
 * and downgrade the version of the JSON schema to OpenAPI 3.0. It's because
 * OpenAI function call feature cannot understand both reference types and
 * OpenAPI 3.1 specification.
 *
 * Additionally, if you've composed `IOpenAiDocument` with
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
export interface IOpenAiDocument {
  /**
   * Version of OpenAPI.
   *
   * OpenAI function call schemas are based on OpenAPI 3.0.3.
   */
  openapi: "3.0.3";

  /**
   * List of function metadata.
   *
   * List of function metadata that can be used for the OpenAI function call.
   *
   * When you want to execute the function with OpenAI constructed arguments,
   * you can do it through {@link OpenAiFetcher.execute} function.
   */
  functions: IOpenAiFunction[];

  /**
   * List of errors occurred during the composition.
   */
  errors: IOpenAiDocument.IError[];

  /**
   * Options for the document.
   *
   * Adjusted options when composing the document through {@link OpenAiComposer}.
   */
  options: IOpenAiDocument.IOptions;
}
export namespace IOpenAiDocument {
  /**
   * Error occurred in the composition.
   */
  export interface IError {
    /**
     * HTTP method of the endpoint.
     */
    method: "get" | "post" | "put" | "patch" | "delete" | "head";

    /**
     * Path of the endpoint.
     */
    path: string;

    /**
     * Error messsages.
     */
    messages: string[];

    /**
     * Get the Swagger operation metadata.
     *
     * Get the Swagger operation metadata, of the source.
     */
    operation: () => ISwaggerOperation;

    /**
     * Get the migration route metadata.
     *
     * Get the migration route metadata, of the source.
     *
     * If the property returns `undefined`, it means that the error has been
     * occured in the migration level, not of OpenAI document composition.
     *
     * @returns Migration route metadata.
     */
    route: () => ISwaggerMigrateRoute | undefined;
  }

  /**
   * Options for composing the OpenAI document.
   */
  export interface IOptions {
    /**
     * Whether the parameters are keyworded or not.
     *
     * If this property value is `true`, length of the
     * {@link IOpenAiDocument.IFunction.parameters} is always 1, and type of the
     * pararameter is always {@link IOpenAiSchema.IObject} type. Also, its
     * properties are following below rules:
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
     * Otherwise (this property value is `false`), length of the
     * {@link IOpenAiDocument.IFunction.parameters} is variable, and sequence of the
     * parameters are following below rules.
     *
     * ```typescript
     * [
     *   ...pathParameters,
     *   ...(query ? [query] : []),
     *   ...(body ? [body] : []),
     * ]
     * ```
     *
     * @default false
     */
    keyword: boolean;

    /**
     * Separator function for the parameters.
     *
     * When composing parameter arguments through OpenAI function call,
     * there can be a case that some parameters must be composed by human, or
     * LLM cannot understand the parameter. For example, if the parameter type
     * has configured {@link IOpenAiSchema.IString["x-wrtn-secret-key"]}, the
     * secret key value must be composed by human, not by LLM (Large Language Model).
     *
     * In that case, if you configure this property with a function that
     * predicating whether the schema value must be composed by human or not,
     * the parameters would be separated into two parts.
     *
     * - {@link IOpenAiFunction.separated.llm}
     * - {@link IOpenAiFunction.separated.human}
     *
     * When writing the function, note that returning value `true` means to be
     * a human composing the value, and `false` means to LLM composing the value.
     * Also, when predicating the schema, it would better to utilize the
     * {@link OpenAiTypeChecker} features.
     *
     * @param schema Schema to be separated.
     * @returns Whether the schema value must be composed by human or not.
     * @default null
     */
    separate: null | ((schema: IOpenAiSchema) => boolean);
  }
}
