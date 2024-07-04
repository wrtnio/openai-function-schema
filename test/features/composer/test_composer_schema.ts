import { TestValidator } from "@nestia/e2e";
import { IOpenAiSchema, OpenAiComposer } from "@wrtnio/openai-function-schema";
import typia, { IJsonApplication, tags } from "typia";

export const test_composer_schema = (): void => {
  const app: IJsonApplication = typia.json.application<[First]>();
  const schema: IOpenAiSchema | null = OpenAiComposer.schema(app.components)(
    app.schemas[0],
  );
  TestValidator.equals("schema")(schema)({
    type: "object",
    required: ["second"],
    properties: {
      second: {
        type: "object",
        required: ["third"],
        properties: {
          third: {
            type: "object",
            required: ["id"],
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
            },
          },
        },
      },
    },
  });
};

interface First {
  second: Second;
}
interface Second {
  third: Third;
}
interface Third {
  id: string & tags.Format<"uuid">;
}
