import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { INestQuery } from "../../../api/structures/INestQuery";
import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_query_nest = async (
  props: ITestProps,
): Promise<void> => {
  const query: IQuery = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("get", "/query/nest"),
    connection: props.connection,
    arguments: [
      {
        query: typia.random<INestQuery>(),
      },
    ],
  });
  typia.assert(query);
};
