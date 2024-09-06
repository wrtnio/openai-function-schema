import {
  IMigrateDocument,
  IMigrateRoute,
  OpenApi,
  OpenApiV3,
  OpenApiV3_1,
  SwaggerV2,
} from "@samchon/openapi";
import { OpenApiTypeChecker } from "@samchon/openapi/lib/internal/OpenApiTypeChecker";
import { OpenApiV3Downgrader } from "@samchon/openapi/lib/internal/OpenApiV3Downgrader";
import typia from "typia";

import { OpenAiSchemaSeparator } from "./internal/OpenAiSchemaSeparator";
import { IOpenAiSchema, ISwaggerOperation, OpenAiTypeChecker } from "./module";
import { IOpenAiDocument } from "./structures/IOpenAiDocument";
import { IOpenAiFunction } from "./structures/IOpenAiFunction";
import { ISwagger } from "./structures/ISwagger";
import { ISwaggerMigrate } from "./structures/ISwaggerMigrate";

/**
 * OpenAI Document Composer.
 *
 * `OpenAiComposer` is a module for composing OpenAI function call schemas from
 * Swagger (OpenAPI) document. The composed OpenAI document can be utilized for
 * executing the actual function call with {@link OpenAiFetcher}.
 *
 * Also, if you've configured the {@link IOpenAiDocument.IOptions.separate}
 * option, then the function call schemas would be separated into two parts;
 * LLM (Large Language Model) and human. In that case, you can combine both
 * LLM and human composed arguments into one by utilizing
 * {@link OpenAiDataCombiner.parameters} function.
 *
 * Additionall, if you've configured the {@link IOpenAiDocument.IOptions.keyword}
 * option, then the number of parameters in every function schemas would be only
 * one, by wrapping all parameters into a single object. However, do not worry.
 * {@link OpenAiFetcher} will automatically unwrap the object and pass the
 * parameters to the actual function call.
 *
 * @author Samchon
 */
export namespace OpenAiComposer {
  /**
   * Properties of {@link document} function.
   */
  export interface IProps {
    /**
     * Input Swagger (OpenAPI) document.
     *
     * No matter how the version of OpenAPI is, `OpenAiComposer` supports
     * every versions of the OpenAPI (Swagger) document.
     */
    swagger:
      | ISwagger
      | SwaggerV2.IDocument
      | OpenApiV3.IDocument
      | OpenApiV3_1.IDocument;

    /**
     * Options for composing the OpenAI function call schema document.
     */
    options?: Partial<IOpenAiDocument.IOptions>;

    /**
     * Migrate document from Swagger.
     *
     * If you've already migrated from the Swagger document, you can re-use it.
     */
    migrate?: ISwaggerMigrate;
  }

  /**
   * Compose OpenAI document of function call schemas.
   *
   * Composes {@link IOpenAiDocument} from OpenAPI (or Swagger) document. In
   * the composed OpenAI document, you can find the function call schemas
   * which can be utilized for executing the actual function call with
   * {@link OpenAiFetcher}.
   *
   * Also, if you've configured the {@link IOpenAiDocument.IOptions.separate}
   * option, then the function call schemas would be separated into two parts;
   * LLM (Large Language Model) and human. In that case, you can combine both
   * LLM and human composed arguments into one by utilizing
   * {@link OpenAiDataCombiner.parameters} function.
   *
   * Additionall, if you've configured the {@link IOpenAiDocument.IOptions.keyword}
   * option, then the number of parameters in every function schemas would be only
   * one, by wrapping all parameters into a single object. However, do not worry.
   * {@link OpenAiFetcher} will automatically unwrap the object and pass the
   * parameters to the actual function call.
   *
   * @param props Properties for composing the OpenAI document.
   * @returns Composed OpenAI document.
   */
  export const document = (props: IProps): IOpenAiDocument => {
    // LIST UP ARGUMENTS
    typia.assert(props);
    const swagger: ISwagger = OpenApi.convert(props.swagger);
    const options: IOpenAiDocument.IOptions = {
      keyword: props.options?.keyword ?? false,
      separate: props.options?.separate ?? null,
    };

    // MIGRATE FROM SWAGGER
    const migrate: IMigrateDocument = props.migrate
      ? props.migrate
      : OpenApi.migrate(swagger);

    // COMPOSE FUNCTIONS
    const errors: IOpenAiDocument.IError[] = migrate.errors.map((e) => ({
      method: e.method,
      path: e.path,
      messages: e.messages,
      operation: () => e.operation(),
      route: () => undefined,
    }));
    const functions: IOpenAiFunction[] = migrate.routes
      .map((route) => {
        if (route.method === "head") return null;
        const func: IOpenAiFunction | null = composeFunction(options)(
          swagger.components,
        )(route);
        if (func === null)
          errors.push({
            method: route.method,
            path: route.path,
            messages: ["Failed to escape $ref"],
            operation: () => route.operation(),
            route: () => route,
          });
        return func;
      })
      .filter((v): v is IOpenAiFunction => v !== null);
    return {
      openapi: "3.0.3",
      version: swagger.info?.version,
      functions,
      errors,
      options,
    };
  };

  /**
   * Convert JSON schema to OpenAI schema.
   *
   * Converts JSON schema to OpenAI schema, which escapes `$ref` and downgrades
   * the schema to the OpenAPI v3 specification. The reason why of escaping `$ref`
   * and downgrading the OpenAPI version is that, OpenAI cannot understand both
   * `$ref` and OpenAPI v3.1 specification.
   *
   * For reference, if your Swagger document containg the JSON schema is not the
   * spec of OpenAPI v3. emended1, you can pre-convert it to OpenAPI v3.1 emended
   * by utilizing the {@link OpenApi.convert} function.
   *
   * @param components Reusable components of Swagger document
   * @param schema JSON schema to be converted
   * @returns OpenAI schema if succeeded, otherwise `null`
   */
  export const schema = (
    components: OpenApi.IComponents,
    schema: OpenApi.IJsonSchema,
  ): IOpenAiSchema | null => {
    const escaped: OpenApi.IJsonSchema | null = escapeReference(components)(
      new Set(),
    )(schema);
    if (escaped === null) return null;
    const downgraded: IOpenAiSchema = OpenApiV3Downgrader.downgradeSchema({
      original: {},
      downgraded: {},
    })(escaped) as IOpenAiSchema;
    OpenAiTypeChecker.visit(downgraded, (schema) => {
      if (
        OpenAiTypeChecker.isOneOf(schema) &&
        (schema as any).discriminator !== undefined
      )
        delete (schema as any).discriminator;
    });
    return downgraded;
  };

  const composeFunction =
    (options: IOpenAiDocument.IOptions) =>
    (components: OpenApi.IComponents) =>
    (route: IMigrateRoute): IOpenAiFunction | null => {
      // CAST SCHEMA TYPES
      const cast = (s: OpenApi.IJsonSchema) => schema(components, s);
      const output: IOpenAiSchema | null | undefined =
        route.success && route.success ? cast(route.success.schema) : undefined;
      if (output === null) return null;
      const properties: [string, IOpenAiSchema | null][] = [
        ...route.parameters.map((p) => ({
          key: p.key,
          schema: {
            ...p.schema,
            title: p.parameter().title ?? p.schema.title,
            description: p.parameter().description ?? p.schema.description,
          },
        })),
        ...(route.query
          ? [
              {
                key: route.query.key,
                schema: {
                  ...route.query.schema,
                  title: route.query.title() ?? route.query.schema.title,
                  description:
                    route.query.description() ?? route.query.schema.description,
                },
              },
            ]
          : []),
        ...(route.body
          ? [
              {
                key: route.body.key,
                schema: {
                  ...route.body.schema,
                  description:
                    route.body.description() ?? route.body.schema.description,
                },
              },
            ]
          : []),
      ].map((o) => [o.key, cast(o.schema)]);
      if (properties.some(([_k, v]) => v === null)) return null;

      // COMPOSE PARAMETERS
      const parameters: IOpenAiSchema[] = options.keyword
        ? [
            {
              type: "object",
              properties: Object.fromEntries(
                properties as [string, IOpenAiSchema][],
              ),
            },
          ]
        : properties.map(([_k, v]) => v!);
      const operation: ISwaggerOperation = route.operation();

      // FINALIZATION
      return {
        method: route.method as "get",
        path: route.path,
        name: route.accessor.join("_"),
        strict: true,
        parameters,
        separated: options.separate
          ? OpenAiSchemaSeparator.parameters({
              parameters,
              predicator: options.separate,
            })
          : undefined,
        output: output
          ? (OpenApiV3Downgrader.downgradeSchema({
              original: {},
              downgraded: {},
            })(output) as IOpenAiSchema)
          : undefined,
        description: (() => {
          if (operation.summary && operation.description) {
            return operation.description.startsWith(operation.summary)
              ? operation.description
              : [
                  operation.summary,
                  operation.summary.endsWith(".") ? "" : ".",
                  "\n\n",
                  operation.description,
                ].join("");
          }
          return operation.description ?? operation.summary;
        })(),
        route: () => route,
        operation: () => operation,
      };
    };

  const escapeReference =
    (components: OpenApi.IComponents) =>
    (visited: Set<string>) =>
    (input: OpenApi.IJsonSchema): OpenApi.IJsonSchema | null => {
      if (OpenApiTypeChecker.isReference(input)) {
        // REFERENCE
        const name: string = input.$ref.split("#/components/schemas/")[1];
        const target: OpenApi.IJsonSchema | undefined =
          components.schemas?.[name];
        if (!target) return null;
        else if (visited.has(name)) return null;
        return escapeReference(components)(new Set([...visited, name]))(target);
      } else if (OpenApiTypeChecker.isOneOf(input)) {
        // ONE-OF
        const oneOf: Array<OpenApi.IJsonSchema | null> = input.oneOf.map(
          (schema) => escapeReference(components)(visited)(schema)!,
        );
        if (oneOf.some((v) => v === null)) return null;
        return {
          ...input,
          oneOf: oneOf as OpenApi.IJsonSchema[],
        };
      } else if (OpenApiTypeChecker.isObject(input)) {
        // OBJECT
        const properties:
          | Array<[string, OpenApi.IJsonSchema | null]>
          | undefined = input.properties
          ? Object.entries(input.properties).map(
              ([key, value]) =>
                [key, escapeReference(components)(visited)(value)] as const,
            )
          : undefined;
        const additionalProperties:
          | OpenApi.IJsonSchema
          | null
          | boolean
          | undefined = input.additionalProperties
          ? typeof input.additionalProperties === "object" &&
            input.additionalProperties !== null
            ? escapeReference(components)(visited)(input.additionalProperties)
            : input.additionalProperties
          : undefined;
        if (properties && properties.some(([_k, v]) => v === null)) return null;
        else if (additionalProperties === null) return null;
        return {
          ...input,
          properties: properties
            ? Object.fromEntries(
                properties.filter(([_k, v]) => !!v) as Array<
                  [string, OpenApi.IJsonSchema]
                >,
              )
            : undefined,
          additionalProperties,
        };
      } else if (OpenApiTypeChecker.isTuple(input)) {
        // TUPLE
        const prefixItems: Array<OpenApi.IJsonSchema | null> =
          input.prefixItems.map((schema) =>
            escapeReference(components)(visited)(schema),
          );
        const additionalItems:
          | OpenApi.IJsonSchema
          | null
          | boolean
          | undefined =
          typeof input.additionalItems === "object" &&
          input.additionalItems !== null
            ? escapeReference(components)(visited)(input.additionalItems)
            : input.additionalItems;
        if (prefixItems.some((v) => v === null)) return null;
        else if (additionalItems === null) return null;
        return {
          ...input,
          prefixItems: prefixItems as OpenApi.IJsonSchema[],
          additionalItems,
        };
      } else if (OpenApiTypeChecker.isArray(input)) {
        // ARRAY
        const items: OpenApi.IJsonSchema | null = escapeReference(components)(
          visited,
        )(input.items);
        if (items === null) return null;
        return {
          ...input,
          items,
        };
      }
      return input;
    };
}
