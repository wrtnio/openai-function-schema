import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_keyword_query_individual = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: true,
    },
  });
  const etc: string = await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "get" && f.path === "/query/individual",
      ),
    ),
    connection: props.connection,
    arguments: [
      {
        query: typia.random<{ etc: string }>(),
      },
    ],
  });
  typia.assert(etc);
};
