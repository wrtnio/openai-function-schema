import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { IPage } from "../../../api/structures/IPage";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_keyword_bbs_article_abridges = async (
  props: ITestProps,
): Promise<void> => {
  const page: IPage<IBbsArticle.ISummary> = await OpenAiFetcher.execute({
    document: props.document("keyword"),
    function: props.function("keyword")("patch", "/bbs/articles/abridges"),
    connection: props.connection,
    arguments: [
      {
        body: typia.random<IPage.IRequest>(),
      },
    ],
  });
  typia.assert(page);
};
