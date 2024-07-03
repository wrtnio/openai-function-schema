import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { IPage } from "../../../api/structures/IPage";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_bbs_article_abridges = async (
  props: ITestProps,
): Promise<void> => {
  const page: IPage<IBbsArticle.ISummary> = await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("patch", "/bbs/articles/abridges"),
    connection: props.connection,
    arguments: [typia.random<IPage.IRequest>()],
  });
  typia.assert(page);
};
