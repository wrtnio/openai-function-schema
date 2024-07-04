import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_keyword_bbs_article_create = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: true,
    },
  });
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "post" && f.path === "/bbs/articles",
      ),
    ),
    connection: props.connection,
    arguments: [
      {
        body: typia.random<IBbsArticle.ICreate>(),
      },
    ],
  });
  typia.assert(article);
};
