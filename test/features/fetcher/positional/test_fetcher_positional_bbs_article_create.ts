import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_positional_bbs_article_create = async (
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
        (f) => f.method === "post" && f.path === "/bbs/articles",
      ),
    ),
    connection: props.connection,
    arguments: [typia.random<IBbsArticle.ICreate>()],
  });
  typia.assert(article);
};
