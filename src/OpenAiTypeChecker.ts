import { IOpenAiSchema } from "./structures/IOpenAiSchema";

/**
 * Type checker for OpenAI function call schema.
 *
 * `OpenAiTypeChecker` is a type checker of {@link IOpenAiSchema}.
 *
 * @author Samchon
 */
export namespace OpenAiTypeChecker {
  export const visit = (
    schema: IOpenAiSchema,
    callback: (schema: IOpenAiSchema) => void,
  ): void => {
    callback(schema);
    if (isOneOf(schema)) schema.oneOf.forEach((s) => visit(s, callback));
    else if (isObject(schema)) {
      for (const [_, s] of Object.entries(schema.properties ?? {}))
        visit(s, callback);
      if (
        typeof schema.additionalProperties === "object" &&
        schema.additionalProperties !== null
      )
        visit(schema.additionalProperties, callback);
    } else if (isArray(schema)) visit(schema.items, callback);
  };

  export const isOneOf = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IOneOf =>
    (schema as IOpenAiSchema.IOneOf).oneOf !== undefined;

  export const isObject = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IObject =>
    (schema as IOpenAiSchema.IObject).type === "object";

  export const isArray = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IArray =>
    (schema as IOpenAiSchema.IArray).type === "array";

  export const isBoolean = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IBoolean =>
    (schema as IOpenAiSchema.IBoolean).type === "boolean";

  export const isNumber = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.INumber =>
    (schema as IOpenAiSchema.INumber).type === "number";

  export const isString = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IString =>
    (schema as IOpenAiSchema.IString).type === "string";

  export const isNullOnly = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.INullOnly =>
    (schema as IOpenAiSchema.INullOnly).type === "null";

  export const isNullable = (schema: IOpenAiSchema): boolean =>
    !isUnknown(schema) &&
    (isNullOnly(schema) ||
      (isOneOf(schema)
        ? schema.oneOf.some(isNullable)
        : schema.nullable === true));

  export const isUnknown = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IUnknown =>
    !isOneOf(schema) && (schema as IOpenAiSchema.IUnknown).type === undefined;
}
