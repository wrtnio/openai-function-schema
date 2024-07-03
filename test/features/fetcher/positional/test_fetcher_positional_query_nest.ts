import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { INestQuery } from "../../../api/structures/INestQuery";
import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_query_nest = async (
  props: ITestProps,
): Promise<void> => {
  const query: IQuery = await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("get", "/query/nest"),
    connection: props.connection,
    arguments: [typia.random<INestQuery>()],
  });
  typia.assert(query);
};
