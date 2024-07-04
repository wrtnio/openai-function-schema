import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";
import { v4 } from "uuid";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_keyword_bbs_article_update = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: true,
    },
  });
  await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "put" && f.path === "/bbs/articles/{id}",
      ),
    ),
    connection: props.connection,
    arguments: [
      {
        id: v4(),
        body: typia.random<IBbsArticle.IUpdate>(),
      },
    ],
  });
};
