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

export const test_fetcher_keyword_query_nest = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: true,
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
    arguments: [
      {
        query: typia.random<INestQuery>(),
      },
    ],
  });
  typia.assert(query);
};
