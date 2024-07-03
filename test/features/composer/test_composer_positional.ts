import { TestValidator } from "@nestia/e2e";
import {
  IOpenAiDocument,
  ISwaggerMigrateRoute,
  OpenAiComposer,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { ITestProps } from "../../internal/ITestProps";

export const test_composer_positional = async ({ swagger }: ITestProps) => {
  const document: IOpenAiDocument = OpenAiComposer.compose({
    swagger,
    options: {
      keyword: false,
    },
  });
  typia.assert(document);
  for (const func of document.functions) {
    const route: ISwaggerMigrateRoute = func.route();
    TestValidator.equals("length")(func.parameters.length)(
      route.parameters.length + (route.query ? 1 : 0) + (route.body ? 1 : 0),
    );
  }
};
