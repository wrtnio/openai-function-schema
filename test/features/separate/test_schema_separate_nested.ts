import { TestValidator } from "@nestia/e2e";
import {
  IOpenAiSchema,
  OpenAiComposer,
  OpenAiTypeChecker,
} from "@wrtnio/openai-function-schema";
import { OpenAiSchemaSeparator } from "@wrtnio/openai-function-schema/lib/internal/OpenAiSchemaSeparator";
import typia, { IJsonApplication, tags } from "typia";

export const test_schema_separate_object = (): void => {
  const separator = OpenAiSchemaSeparator.schema(
    (s) =>
      OpenAiTypeChecker.isString(s) &&
      (s["x-wrtn-secret-key"] !== undefined ||
        s.contentMediaType !== undefined),
  );
  const member: IOpenAiSchema = schema(
    typia.json.application<[Nested<Memeber>]>(),
  );
  const auth: IOpenAiSchema = schema(
    typia.json.application<[Nested<Authorization>]>(),
  );
  const upload: IOpenAiSchema = schema(
    typia.json.application<[Nested<FileUpload>]>(),
  );
  const combined: IOpenAiSchema = schema(
    typia.json.application<[Nested<Combined>]>(),
  );

  TestValidator.equals("member")(separator(member))([member, null]);
  TestValidator.equals("auth")(separator(auth))([null, auth]);
  TestValidator.equals("upload")(separator(upload))([null, upload]);
  TestValidator.equals("combined")(separator(combined))([
    member,
    schema(typia.json.application<[Nested<Authorization & FileUpload>]>()),
  ]);
};

interface Nested<T> {
  first: {
    second: {
      third: {
        fourth: T;
      };
      array: T[];
    };
  };
}
interface Memeber {
  id: number;
  name: string;
}
interface Authorization {
  secretKey: string &
    tags.JsonSchemaPlugin<{
      "x-wrtn-secret-key": "google";
    }>;
}
interface FileUpload {
  file: string & tags.ContentMediaType<"image/png">;
}
interface Combined extends Memeber, Authorization, FileUpload {}

const schema = (app: IJsonApplication): IOpenAiSchema => {
  const schema: IOpenAiSchema | null = OpenAiComposer.schema(app.components)(
    app.schemas[0],
  );
  if (schema === null) throw new Error("Invalid schema");
  return schema;
};
