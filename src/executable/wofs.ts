#!/usr/bin/env node
import { OpenApi, OpenApiV3, OpenApiV3_1, SwaggerV2 } from "@samchon/openapi";
import fs from "fs";

import { OpenAiComposer } from "../OpenAiComposer";
import { ArgumentParser } from "./internal/ArgumentParser";

interface IOptions {
  input: string;
  output: string;
  keyword: boolean;
}
const main = async (): Promise<void> => {
  console.log("--------------------------------------------------------");
  console.log(" Swagger to OpenAI Function Call Schema Converter");
  console.log("--------------------------------------------------------");

  const options: IOptions = await ArgumentParser.parse<IOptions>(
    async (command, prompt, action) => {
      command.option("--input <string>", "Swagger file path");
      command.option(
        "--output <string>",
        "OpenAI Function Call Schema file path",
      );
      command.option(
        "--keyword <true|false>",
        "Whether to wrap parameters into an object with keyword or not",
      );
      return action(async (options) => {
        options.input ??= await prompt.input("input")("Swagger file path:");
        options.output ??= await prompt.input("output")(
          "OpenAI Function Call Schema file path:",
        );
        if (typeof options.keyword === "string")
          options.keyword =
            options.keyword === "true" || options.keyword === "";
        options.keyword ??= await prompt.boolean("keyword")(
          "Whether to wrap parameters into an object with keyword or not:",
        );
        return options as IOptions;
      });
    },
  );
  const swagger:
    | OpenApi.IDocument
    | SwaggerV2.IDocument
    | OpenApiV3.IDocument
    | OpenApiV3_1.IDocument = JSON.parse(
    await fs.promises.readFile(options.input, "utf-8"),
  );
  const document = OpenAiComposer.document({
    swagger,
    options: {
      keyword: options.keyword,
    },
  });
  await fs.promises.writeFile(
    options.output,
    JSON.stringify(document, null, 2),
  );
};
main().catch(console.error);
