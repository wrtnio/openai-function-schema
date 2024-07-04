import fs from "fs";

import { IOpenAiDocument, OpenAiComposer } from "../src";

const PATH = `${__dirname}/../examples`;

const main = async (): Promise<void> => {
  const fileList: string[] = await fs.promises.readdir(`${PATH}/swagger`);
  for (const file of fileList) {
    const swagger: any = JSON.parse(
      await fs.promises.readFile(`${PATH}/swagger/${file}`, "utf8"),
    );
    for (const keyword of [true, false]) {
      const document: IOpenAiDocument = OpenAiComposer.document({
        swagger,
        options: { keyword },
      });
      await fs.promises.writeFile(
        `${PATH}/${keyword ? "keyword" : "positional"}/${file}`,
        JSON.stringify(document, null, 2),
      );
    }
  }
};
main().catch(console.error);
