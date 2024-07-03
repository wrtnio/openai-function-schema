import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_query_body = async (
  props: ITestProps,
): Promise<void> => {
  const query: URLSearchParams = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("post", "/query/body"),
    connection: props.connection,
    arguments: [
      {
        body: typia.random<IQuery>(),
      },
    ],
  });
  typia.assert(query);
};
