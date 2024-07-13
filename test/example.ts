import { OpenApi } from "@samchon/openapi";
import { ISwagger, OpenAiComposer } from "@wrtnio/openai-function-schema";
import fs from "fs";

const main = async (): Promise<void> => {
  const directory: string[] = await fs.promises.readdir("examples/swagger");
  for (const file of directory) {
    const swagger: ISwagger = OpenApi.convert(
      JSON.parse(
        await fs.promises.readFile(`examples/swagger/${file}`, "utf8"),
      ),
    );
    for (const keyword of [false, true])
      await fs.promises.writeFile(
        `examples/${keyword ? "keyword" : "positional"}/${file}`,
        JSON.stringify(
          OpenAiComposer.document({
            swagger,
            options: {
              keyword,
            },
          }),
        ),
        "utf8",
      );
  }
};
main().catch(console.error);
