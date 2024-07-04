import { IOpenAiFunction, IOpenAiSchema, OpenAiTypeChecker } from "../module";

export namespace OpenAiParameterSeparator {
  export interface IProps {
    parameters: IOpenAiSchema[];
    predicator: (schema: IOpenAiSchema) => boolean;
  }
  export const separate = (props: IProps): IOpenAiFunction.ISeparated => {
    const indexes: Array<[IOpenAiSchema | null, IOpenAiSchema | null]> =
      props.parameters.map(separateSchema(props.predicator));
    return {
      llm: indexes
        .filter(([llm]) => llm !== null)
        .map(([llm], index) => ({
          index,
          schema: llm!,
        })),
      human: indexes
        .filter(([, human]) => human !== null)
        .map(([, human], index) => ({
          index,
          schema: human!,
        })),
    };
  };

  const separateSchema =
    (predicator: (schema: IOpenAiSchema) => boolean) =>
    (schema: IOpenAiSchema): [IOpenAiSchema | null, IOpenAiSchema | null] => {
      if (predicator(schema) === true) return [null, schema];
      else if (
        OpenAiTypeChecker.isUnknown(schema) ||
        OpenAiTypeChecker.isOneOf(schema)
      )
        return [schema, null];
      else if (OpenAiTypeChecker.isObject(schema))
        return separateObject(predicator)(schema);
      else if (OpenAiTypeChecker.isArray(schema))
        return separateArray(predicator)(schema);
      return [schema, null];
    };

  const separateArray =
    (predicator: (schema: IOpenAiSchema) => boolean) =>
    (
      schema: IOpenAiSchema.IArray,
    ): [IOpenAiSchema.IArray | null, IOpenAiSchema.IArray | null] => {
      const [x, y] = separateSchema(predicator)(schema.items);
      return [
        x !== null ? { ...schema, items: x } : null,
        y !== null ? { ...schema, items: y } : null,
      ];
    };

  const separateObject =
    (predicator: (schema: IOpenAiSchema) => boolean) =>
    (
      schema: IOpenAiSchema.IObject,
    ): [IOpenAiSchema.IObject | null, IOpenAiSchema.IObject | null] => {
      if (
        !!schema.additionalProperties ||
        Object.keys(schema.properties ?? {}).length === 0
      )
        return [schema, null];
      const llm = {
        ...schema,
        properties: {} as Record<string, IOpenAiSchema>,
      } satisfies IOpenAiSchema.IObject;
      const humna = {
        ...schema,
        properties: {} as Record<string, IOpenAiSchema>,
      } satisfies IOpenAiSchema.IObject;
      for (const [key, value] of Object.entries(schema.properties ?? {})) {
        const [x, y] = separateSchema(predicator)(value);
        if (x !== null) llm.properties[key] = x;
        if (y !== null) humna.properties[key] = y;
      }
      return [
        Object.keys(llm.properties).length === 0 ? null : llm,
        Object.keys(humna.properties).length === 0 ? null : humna,
      ];
    };
}
