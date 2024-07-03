import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_bbs_article_create = async (
  props: ITestProps,
): Promise<void> => {
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("post", "/bbs/articles"),
    connection: props.connection,
    arguments: [
      {
        body: typia.random<IBbsArticle.ICreate>(),
      },
    ],
  });
  typia.assert(article);
};
