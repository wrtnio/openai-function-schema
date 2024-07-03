# OpenAI Function Schema
![Wrtn Technologies](https://private-user-images.githubusercontent.com/13158709/321905275-37201d90-b961-4d6d-a1e4-98158a810a36.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTk5ODA3NDQsIm5iZiI6MTcxOTk4MDQ0NCwicGF0aCI6Ii8xMzE1ODcwOS8zMjE5MDUyNzUtMzcyMDFkOTAtYjk2MS00ZDZkLWExZTQtOTgxNThhODEwYTM2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzAzVDA0MjA0NFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTZiOTJkMzc2YTFjZDI0OWVlZjI1Njc5NTQ2MWM3ODg5YjNmNTZkOTY5YjQ1YzRhZTc5MWQxNDczZjQ2OGZiNmImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.hItP1U2rwwgjmahoCvLixia035hcgs5wo_znPgZmlrI)

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