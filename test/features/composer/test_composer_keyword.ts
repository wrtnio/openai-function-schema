import { TestValidator } from "@nestia/e2e";
import {
  IOpenAiDocument,
  IOpenAiSchema,
  ISwaggerMigrateRoute,
  OpenAiComposer,
  OpenAiTypeChecker,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { ITestProps } from "../../structures/ITestProps";

export const test_composer_keyword = async ({ swagger }: ITestProps) => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger,
    options: {
      keyword: true,
    },
  });
  typia.assert(document);
  for (const func of document.functions) {
    const route: ISwaggerMigrateRoute = func.route();
    TestValidator.equals("length")(1)(func.parameters.length);
    TestValidator.equals("properties")([
      ...route.parameters.map((p) => p.key),
      ...(route.query ? ["query"] : []),
      ...(route.body ? ["body"] : []),
    ])(
      (() => {
        const schema: IOpenAiSchema = func.parameters[0];
        if (!OpenAiTypeChecker.isObject(schema)) return [];
        return Object.keys(schema.properties ?? {});
      })(),
    );
  }
};
