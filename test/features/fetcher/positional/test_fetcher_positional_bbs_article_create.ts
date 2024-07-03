import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_bbs_article_create = async (
  props: ITestProps,
): Promise<void> => {
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("post", "/bbs/articles"),
    connection: props.connection,
    arguments: [typia.random<IBbsArticle.ICreate>()],
  });
  typia.assert(article);
};
