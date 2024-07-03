import { OpenAiFetcher } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { IMultipart } from "../../../api/structures/IMultipart";
import { ITestProps } from "../../../internal/ITestProps";

export const test_fetcher_positional_multipart_post = async (
  props: ITestProps,
): Promise<void> => {
  const content: IMultipart.IContent = await OpenAiFetcher.execute({
    document: props.document("positional"),
    function: props.function("positional")("post", "/multipart"),
    connection: props.connection,
    arguments: [
      {
        title: "something",
        blob: new Blob([new Uint8Array(999).fill(0)]),
        blobs: new Array(10)
          .fill(0)
          .map((_, i) => new Blob([new Uint8Array(999).fill(i)])),
        description: "nothing, but special",
        file: new File([new Uint8Array(999).fill(1)], "first.png"),
        flags: [1, 2, 3, 4],
        files: new Array(10)
          .fill(0)
          .map((_, i) => new File([new Uint8Array(999).fill(i)], `${i}.png`)),
        notes: ["something, important", "note2"],
      } satisfies IMultipart,
    ],
  });
  typia.assert(content);
};
