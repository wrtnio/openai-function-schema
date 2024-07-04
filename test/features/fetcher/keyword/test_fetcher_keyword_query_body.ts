import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_keyword_query_body = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: true,
    },
  });
  const query: URLSearchParams = await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "post" && f.path === "/query/body",
      ),
    ),
    connection: props.connection,
    arguments: [
      {
        body: typia.random<IQuery>(),
      },
    ],
  });
  typia.assert(query);
};
