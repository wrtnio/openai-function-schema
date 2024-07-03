import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";
import { v4 } from "uuid";

import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_query_composite = async (
  props: ITestProps,
): Promise<void> => {
  const query: IQuery = await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("get", "/query/composite/{id}"),
    connection: props.connection,
    arguments: [v4(), typia.random<IQuery>()],
  });
  typia.assert(query);
};
