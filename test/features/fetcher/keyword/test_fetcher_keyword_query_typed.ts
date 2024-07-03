import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_query_typed = async (
  props: ITestProps,
): Promise<void> => {
  const query: IQuery = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("get", "/query/typed"),
    connection: props.connection,
    arguments: [
      {
        query: typia.random<IQuery>(),
      },
    ],
  });
  typia.assert(query);
};
