import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";
import { v4 } from "uuid";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_bbs_article_update = async (
  props: ITestProps,
): Promise<void> => {
  await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("put", "/bbs/articles/{id}"),
    connection: props.connection,
    arguments: [v4(), typia.random<IBbsArticle.IUpdate>()],
  });
};
