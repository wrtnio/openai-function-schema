# OpenAI Function Schema
![Wrtn Technologies](https://github.com/wrtnio/openai-function-schema/assets/13158709/48ee1578-f7cd-4e64-abd9-8354716ec0c9)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnio/openai-function/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/@wrtnio/openai-function-schema.svg)](https://www.npmjs.com/package/@wrtnio/openai-function-schema)
[![Downloads](https://img.shields.io/npm/dm/@wrtnio/openai-function-schema.svg)](https://www.npmjs.com/package/@wrtnio/openai-function-schema)
[![Build Status](https://github.com/wrtnio/openai-function-schema/workflows/build/badge.svg)](https://github.com/wrtnio/openai-function-schema/actions?query=workflow%3Abuild)

OpenAI function call schema definition, converter and executor.

`@wrtnio/openai-function-schema` supports OpenAI function call schema definitions, and converter from Swagger (OpenAPI) documents. About the converter from Swagger (OpenAPI) documents, `@wrtnio/openai-function-schema` supports every versions of them.

  - Swagger v2.0
  - OpenAPI v3.0
  - OpenApi v3.1

Also, `@wrtnio/openai-function-schema` provides function call executor from [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts) and [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts), so that you can easily execute the remote Restful API operation with OpenAI composed arguments.

Let's learn how to use it by example code of below.




## Setup
```bash
npm install @wrtnio/openai-function-schema
```

```typescript
import {
  OpenAiComposer,
  OpenAiFetcher,
  IOpenAiDocument,
  IOpenAiFunction
} from "@wrtnio/openai-function-schema";
import fs from "fs";

const main = async (): Promise<void> => {
  const swagger = JSON.parse(
    await fs.promises.readFile("swagger.json", "utf8"),
  );
  const document: IOpenAiDocument = OpenAiComposer.document({ swagger });
  const func: IOpenAiFunction = document.functions.find(
    (f) => f.method === "post" && f.path === "/bbs/articles",
  )!;
  await OpenAiFetcher.execute({
    document,
    function: func,
    arguments: [
      {
        title: "article title",
        body: "article content body",
        format: "md",
        files: [],
      },
    ],
  });
};
main().catch(console.error);
```




## Features
About supported features, please read description comments of each component.

I'm preparing documentation and playground website of `@wrtnio/openai-function-schema` features. Until that, please read below components' description comments. Even though you have to read source code of each component, but description comments would satisfy you.

- Schema Definitions
  - [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts): OpenAI function metadata collection with options
  - [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiFunction.ts): OpenAI's function metadata
  - [`IOpenAiSchema`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiSchema.ts): Type schema info escaped `$ref`.
- Functions
  - [`OpenAiComposer`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiComposer.ts): Compose `IOpenAiDocument` from Swagger (OpenAPI) document
  - [`OpenAiFetcher`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiFetcher.ts): Function call executor with `IOpenAiFunction`
  - [`OpenAiDataCombiner`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiDataCombiner.ts): Data combiner for LLM function call with human composed data
  - [`OpenAiTypeChecker`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiTypeChecker.ts): Type checker for `IOpenAiSchema`
