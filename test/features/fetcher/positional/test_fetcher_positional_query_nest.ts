import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { INestQuery } from "../../../api/structures/INestQuery";
import { IQuery } from "../../../api/structures/IQuery";
import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_positional_query_nest = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: Math.random() < 0.5 ? false : undefined,
    },
  });
  const query: IQuery = await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "get" && f.path === "/query/nest",
      ),
    ),
    connection: props.connection,
    arguments: [typia.random<INestQuery>()],
  });
  typia.assert(query);
};
