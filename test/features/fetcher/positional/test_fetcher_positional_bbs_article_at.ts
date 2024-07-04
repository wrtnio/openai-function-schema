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

export const test_fetcher_positional_bbs_article_at = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: Math.random() < 0.5 ? false : undefined,
    },
  });
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "get" && f.path === "/bbs/articles/{id}",
      ),
    ),
    connection: props.connection,
    arguments: [v4()],
  });
  typia.assert(article);
};
