import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiDataCombiner,
  OpenAiFetcher,
  OpenAiTypeChecker,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IMembership } from "../../api/structures/IMembership";
import { ITestProps } from "../../structures/ITestProps";

export const test_combiner_keyword_parameters_body = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: true,
      separate: (schema) =>
        OpenAiTypeChecker.isString(schema) &&
        (schema["x-wrtn-secret-key"] !== undefined ||
          schema["contentMediaType"] !== undefined),
    },
  });

  const operation: IOpenAiFunction = typia.assert<IOpenAiFunction>(
    document.functions.find(
      (f) => f.method === "post" && f.path === "/membership/join",
    ),
  );
  const membership: IMembership = await OpenAiFetcher.execute({
    document,
    function: operation,
    connection: props.connection,
    arguments: OpenAiDataCombiner.parameters({
      function: operation,
      llm: [
        {
          body: {
            name: "Wrtn Technologies",
            email: "master@wrtn.io",
            password: "1234",
            age: 20,
            gender: 1,
          },
        },
      ],
      human: [
        {
          body: {
            secretKey: "something",
            picture: "https://wrtn.io/logo.png",
          },
        },
      ],
    }),
  });
  typia.assert(membership);
};
