import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";
import { IPage } from "../../../api/structures/IPage";
import { ITestProps } from "../../../structures/ITestProps";

export const test_fetcher_positional_bbs_article_abridges = async (
  props: ITestProps,
): Promise<void> => {
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger: props.swagger,
    options: {
      keyword: Math.random() < 0.5 ? false : undefined,
    },
  });
  const page: IPage<IBbsArticle.ISummary> = await OpenAiFetcher.execute({
    document,
    function: typia.assert<IOpenAiFunction>(
      document.functions.find(
        (f) => f.method === "patch" && f.path === "/bbs/articles/abridges",
      ),
    ),
    connection: props.connection,
    arguments: [typia.random<IBbsArticle.IRequest>()],
  });
  typia.assert(page);
};
