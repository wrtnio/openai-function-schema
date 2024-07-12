import { TestValidator } from "@nestia/e2e";
import { IOpenAiSchema, OpenAiComposer } from "@wrtnio/openai-function-schema";
import typia, { IJsonApplication, tags } from "typia";

export const test_composer_schema = (): void => {
  const app: IJsonApplication = typia.json.application<[First]>();
  const schema: IOpenAiSchema | null = OpenAiComposer.schema(
    app.components,
    app.schemas[0],
  );
  TestValidator.equals("schema")(schema)({
    type: "object",
    required: ["second"],
    properties: {
      second: {
        type: "object",
        required: ["third"],
        description: "The second property",
        properties: {
          third: {
            type: "object",
            required: ["id"],
            description: "The third property",
            properties: {
              id: {
                type: "string",
                format: "uuid",
                description: "Hello word",
              },
            },
          },
        },
      },
    },
  });
};

interface First {
  /**
   * The second property
   */
  second: Second;
}
interface Second {
  /**
   * The third property
   */
  third: Third;
}
interface Third {
  /**
   * Hello word
   */
  id: string & tags.Format<"uuid">;
}
