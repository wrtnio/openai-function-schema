import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_query_individual = async (
  props: ITestProps,
): Promise<void> => {
  const etc: string = await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("get", "/query/individual"),
    connection: props.connection,
    arguments: [typia.random<{ etc: string }>()],
  });
  typia.assert(etc);
};
