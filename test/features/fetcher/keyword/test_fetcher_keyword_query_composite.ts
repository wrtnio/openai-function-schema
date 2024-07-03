import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";
import { v4 } from "uuid";

import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_query_composite = async (
  props: ITestProps,
): Promise<void> => {
  const query: IQuery = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("get", "/query/composite/{id}"),
    connection: props.connection,
    arguments: [
      {
        id: v4(),
        query: typia.random<IQuery>(),
      },
    ],
  });
  typia.assert(query);
};
