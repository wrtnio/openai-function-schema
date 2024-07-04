import { TestValidator } from "@nestia/e2e";
import {
  IOpenAiSchema,
  OpenAiTypeChecker,
} from "@wrtnio/openai-function-schema";
import { OpenAiSchemaSeparator } from "@wrtnio/openai-function-schema/lib/internal/OpenAiSchemaSeparator";

export const test_schema_separate_string = (): void => {
  const separator = OpenAiSchemaSeparator.schema(
    (s) =>
      OpenAiTypeChecker.isString(s) &&
      (s["x-wrtn-secret-key"] !== undefined ||
        s.contentMediaType !== undefined),
  );

  const plain: IOpenAiSchema = { type: "string" };
  const secret: IOpenAiSchema = {
    type: "string",
    "x-wrtn-secret-key": "google",
  };
  const upload: IOpenAiSchema = {
    type: "string",
    contentMediaType: "image/png",
  };

  TestValidator.equals("plain")(separator(plain))([plain, null]);
  TestValidator.equals("secret")(separator(secret))([null, secret]);
  TestValidator.equals("upload")(separator(upload))([null, upload]);
};
