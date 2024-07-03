# OpenAI Function Schema
![Wrtn Technologies](https://github.com/wrtnio/openai-function-schema/assets/13158709/48ee1578-f7cd-4e64-abd9-8354716ec0c9)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnio/openai-function/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/@wrtnio/openai-function-schema.svg)](https://www.npmjs.com/package/@wrtnio/openai-function-schema)
[![Downloads](https://img.shields.io/npm/dm/@wrtnio/openai-function-schema.svg)](https://www.npmjs.com/package/@wrtnio/openai-function-schema)
[![Build Status](https://github.com/wrtnio/openai-function/workflows/build/badge.svg)](https://github.com/wrtnio/openai-function/actions?query=workflow%3Abuild)

OpenAI function call schema definition, converter and executor.

`@wrtnio/openai-function-schema` supports OpenAI function call schema definitions, and converter from Swagger (OpenAPI) documents. About the converter from Swagger (OpenAPI) document, `@wrtnio/openai-function-schema` supports every versions of them.

Also, `@wrtnio/openai-function-schema` provides function call executor from [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts) and [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts), so that you can easily execute the remote Restful API operation with OpenAI composed arguments.

  - [Swagger v2](https://github.com/samchon/openapi/blob/master/src/SwaggerV2.ts) -> [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts)
  - [OpenAPI v3.0](https://github.com/samchon/openapi/blob/master/src/OpenApiV3.ts) -> [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts)
  - [OpenApi v3.1](https://github.com/samchon/openapi/blob/master/src/OpenApiV3_1.ts) -> [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts)




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
  const document: IOpenAiDocument = OpenAiComposer.compose({ swagger });
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
- Functions
  - [`OpenAiComposer`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/OpenAiComposer.ts): Compose `IOpenAiDocument` from Swagger (OpenAPI) document
  - [`OpenAiFetcher`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/OpenAiFetcher.ts): Function call executor with `IOpenAiFunction`
  - [`OpenAiTypeChecker`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/OpenAiTypeChecker.ts): Type checker for `IOpenAiSchema`
- Structures
  - [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts): OpenAI function metadata collection with options
  - [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiFunction.ts): OpenAI's function metadata
  - [`IOpenAiSchema`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiSchema.ts): Type schema info escaped `$ref`.