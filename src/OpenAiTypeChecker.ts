import { IOpenAiSchema } from "./structures/IOpenAiSchema";

/**
 * Type checker for OpenAI function call schema.
 *
 * `OpenAiTypeChecker` is a type checker of {@link IOpenAiSchema}.
 *
 * @author Samchon
 */
export namespace OpenAiTypeChecker {
  /**
   * Visit every nested schemas.
   *
   * Visit every nested schemas of the target, and apply the callback function
   * to them.
   *
   * If the visitor meets an union type, it will visit every individual schemas
   * in the union type. Otherwise meets an object type, it will visit every
   * properties and additional properties. If the visitor meets an array type,
   * it will visit the item type.
   *
   * @param schema Target schema to visit
   * @param callback Callback function to apply
   */
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

  /**
   * Test whether the schema is an union type.
   *
   * @param schema Target schema
   * @returns Whether union type or not
   */
  export const isOneOf = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IOneOf =>
    (schema as IOpenAiSchema.IOneOf).oneOf !== undefined;

  /**
   * Test whether the schema is an object type.
   *
   * @param schema Target schema
   * @returns Whether object type or not
   */
  export const isObject = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IObject =>
    (schema as IOpenAiSchema.IObject).type === "object";

  /**
   * Test whether the schema is an array type.
   *
   * @param schema Target schema
   * @returns Whether array type or not
   */
  export const isArray = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IArray =>
    (schema as IOpenAiSchema.IArray).type === "array";

  /**
   * Test whether the schema is a boolean type.
   *
   * @param schema Target schema
   * @returns Whether boolean type or not
   */
  export const isBoolean = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IBoolean =>
    (schema as IOpenAiSchema.IBoolean).type === "boolean";

  /**
   * Test whether the schema is a number type.
   *
   * @param schema Target schema
   * @returns Whether number type or not
   */
  export const isNumber = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.INumber =>
    (schema as IOpenAiSchema.INumber).type === "number";

  /**
   * Test whether the schema is a string type.
   *
   * @param schema Target schema
   * @returns Whether string type or not
   */
  export const isString = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IString =>
    (schema as IOpenAiSchema.IString).type === "string";

  /**
   * Test whether the schema is a null type.
   *
   * @param schema Target schema
   * @returns Whether null type or not
   */
  export const isNullOnly = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.INullOnly =>
    (schema as IOpenAiSchema.INullOnly).type === "null";

  /**
   * Test whether the schema is a nullable type.
   *
   * @param schema Target schema
   * @returns Whether nullable type or not
   */
  export const isNullable = (schema: IOpenAiSchema): boolean =>
    !isUnknown(schema) &&
    (isNullOnly(schema) ||
      (isOneOf(schema)
        ? schema.oneOf.some(isNullable)
        : schema.nullable === true));

  /**
   * Test whether the schema is an unknown type.
   *
   * @param schema Target schema
   * @returns Whether unknown type or not
   */
  export const isUnknown = (
    schema: IOpenAiSchema,
  ): schema is IOpenAiSchema.IUnknown =>
    !isOneOf(schema) && (schema as IOpenAiSchema.IUnknown).type === undefined;
}
