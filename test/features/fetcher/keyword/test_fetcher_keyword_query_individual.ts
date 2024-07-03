import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_query_individual = async (
  props: ITestProps,
): Promise<void> => {
  const etc: string = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("get", "/query/individual"),
    connection: props.connection,
    arguments: [
      {
        query: typia.random<{ etc: string }>(),
      },
    ],
  });
  typia.assert(etc);
};
