import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";
import { v4 } from "uuid";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_bbs_article_update = async (
  props: ITestProps,
): Promise<void> => {
  await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("put", "/bbs/articles/{id}"),
    connection: props.connection,
    arguments: [
      {
        id: v4(),
        body: typia.random<IBbsArticle.IUpdate>(),
      },
    ],
  });
};
