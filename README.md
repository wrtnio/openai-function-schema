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
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import fs from "fs";
import typia from "typia";
import { v4 } from "uuid";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";

const main = async (): Promise<void> => {
  // COMPOSE OPENAI FUNCTION CALL SCHEMAS
  const swagger = JSON.parse(
    await fs.promises.readFile("swagger.json", "utf8"),
  );
  const document: IOpenAiDocument = OpenAiComposer.document({ 
    swagger 
  });

  // EXECUTE OPENAI FUNCTION CALL
  const func: IOpenAiFunction = document.functions.find(
    (f) => f.method === "put" && f.path === "/bbs/articles",
  )!;
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document,
    function: func,
    connection: { host: "http://localhost:3000" },
    arguments: [
      // imagine that arguments are composed by OpenAI
      v4(),
      typia.random<IBbsArticle.ICreate>(),
    ],
  });
  typia.assert(article);
};
main().catch(console.error);
```




## Features
About supported features, please read description comments of each component.

I'm preparing documentation and playground website of `@wrtnio/openai-function-schema` features. Until that, please read below components' description comments. Even though you have to read source code of each component, but description comments of them may satisfy you.

- Schema Definitions
  - [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts): OpenAI function metadata collection with options
  - [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiFunction.ts): OpenAI's function metadata
  - [`IOpenAiSchema`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiSchema.ts): Type schema info escaped `$ref`.
- Functions
  - [`OpenAiComposer`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiComposer.ts): Compose `IOpenAiDocument` from Swagger (OpenAPI) document
  - [`OpenAiFetcher`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiFetcher.ts): Function call executor with `IOpenAiFunction`
  - [`OpenAiDataCombiner`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiDataCombiner.ts): Data combiner for LLM function call with human composed data
  - [`OpenAiTypeChecker`](https://github.com/wrtnio/openai-function-schema/blob/master/src/OpenAiTypeChecker.ts): Type checker for `IOpenAiSchema`

### Command Line Interface
```bash
########
# LAUNCH CLI
########
# PRIOR TO NODE V20
npm install -g @wrtnio/openai-function-schema
npx wofs

# SINCE NODE V20
npx @wrtnio/openai-function-schema

########
# PROMPT
########
--------------------------------------------------------
 Swagger to OpenAI Function Call Schema Converter
--------------------------------------------------------
? Swagger file path: test/swagger.json
? OpenAI Function Call Schema file path: test/plain.json
? Whether to wrap parameters into an object with keyword or not: No
```

Convert swagger to OpenAI function schema file by a CLI command.

If you run `npx @wrtnio/openai-function-schema` (or `npx wofs` after global setup), the CLI (Command Line Interface) will inquiry those arguments. After you fill all of them, the OpenAI fuction call schema file of [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts) type would be created to the target location.

If you want to specify arguments without prompting, you can fill them like below:

```bash
# PRIOR TO NODE V20
npm install -g @wrtnio/openai-function-schema
npx wofs --input swagger.json --output openai.json --keyword false

# SINCE NODE V20
npx @wrtnio/openai-function-schema
  --input swagger.json 
  --output openai.json 
  --keyword false
```

Here is the list of [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/main/src/structures/IOpenAiDocument.ts) files generated by CLI command.

Project       | Swagger | Positional | Keyworded
--------------|---------|--------|-----------
BBS           | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/bbs.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/bbs.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/bbs.json)
Clickhouse    | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/clickhouse.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/clickhouse.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/clickhouse.json)
Fireblocks    | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/fireblocks.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/fireblocks.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/fireblocks.json)
Iamport       | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/iamport.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/iamport.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/iamport.json)
PetStore      | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/petstore.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/petstore.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/petstore.json)
Shopping Mall | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/shopping.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/shopping.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/shopping.json)
Toss Payments | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/toss.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/toss.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/toss.json)
Uber          | [swagger.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/swagger/uber.json) | [positional.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/positional/uber.json) | [keyworded.json](https://github.com/wrtnio/openai-function-schema/blob/main/examples/keyword/uber.json)




### Library API
If you want to utilize `@wrtnio/openai-function-schema` in the API level, you should start from composing [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts) through `OpenAiComposer.document()` method. 

After composing the [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts) data, you may provide the nested [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiFunction.ts) instances to the OpenAI, and the OpenAI may compose the arguments by its function calling feature. With the OpenAI automatically composed arguments, you can execute the function call by `OpenAiFetcher.execute()` method.

Here is the example code composing and executing the [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiFunction.ts).

  - Test Function: [test_fetcher_positional_bbs_article_update.ts](https://github.com/wrtnio/openai-function-schema/blob/main/test/features/fetcher/positional/test_fetcher_positional_bbs_article_update.ts)
  - Backend Server Code: [BbsArticlesController.ts](https://github.com/wrtnio/openai-function-schema/blob/main/test/controllers/BbsArticlesController.ts)

```typescript
import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import fs from "fs";
import typia from "typia";
import { v4 } from "uuid";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";

const main = async (): Promise<void> => {
  // COMPOSE OPENAI FUNCTION CALL SCHEMAS
  const swagger = JSON.parse(
    await fs.promises.readFile("swagger.json", "utf8"),
  );
  const document: IOpenAiDocument = OpenAiComposer.document({ 
    swagger 
  });

  // EXECUTE OPENAI FUNCTION CALL
  const func: IOpenAiFunction = document.functions.find(
    (f) => f.method === "put" && f.path === "/bbs/articles",
  )!;
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document,
    function: func,
    connection: { host: "http://localhost:3000" },
    arguments: [
      // imagine that arguments are composed by OpenAI
      v4(),
      typia.random<IBbsArticle.ICreate>(),
    ],
  });
  typia.assert(article);
};
main().catch(console.error);
```

By the way, above example code's target operation function has multiple parameters. You know what? If you configure a function to have only one parameter by wrapping into one object type, OpenAI function calling feature constructs arguments a little bit efficiently than multiple parameters case.

Such only one object typed parameter is called `keyword parameter`, and `@wrtnio/openai-function-schema` supports such keyword parameterized function schemas. When composing [`IOpenAiDocument`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts) by `OpenAiComposer.document()` method, configures `option.keyword` to be `true`, then every [`IOpenAiFunction`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiFunction.ts) instances would be keyword parameterized. Also, `OpenAiFetcher` understands the keyword parameterized function specification, so that performs proper execution by automatic decomposing the arguments.

Here is the example code of keyword parameterizing.

  - Test Function: [test_fetcher_keyword_bbs_article_update.ts](https://github.com/wrtnio/openai-function-schema/blob/main/test/features/fetcher/keyword/test_fetcher_keyword_bbs_article_update.ts)
  - Backend Server Code: [BbsArticlesController.ts](https://github.com/wrtnio/openai-function-schema/blob/main/test/controllers/BbsArticlesController.ts)

```typescript
import {
  IOpenAiDocument,
  IOpenAiFunction,
  OpenAiComposer,
  OpenAiFetcher,
} from "@wrtnio/openai-function-schema";
import fs from "fs";
import typia from "typia";
import { v4 } from "uuid";

import { IBbsArticle } from "../../../api/structures/IBbsArticle";

const main = async (): Promise<void> => {
  // COMPOSE OPENAI FUNCTION CALL SCHEMAS
  const swagger = JSON.parse(
    await fs.promises.readFile("swagger.json", "utf8"),
  );
  const document: IOpenAiDocument = OpenAiComposer.document({ 
    swagger,
    options: {
      keyword: true, // keyword parameterizing
    }
  });

  // EXECUTE OPENAI FUNCTION CALL
  const func: IOpenAiFunction = document.functions.find(
    (f) => f.method === "put" && f.path === "/bbs/articles",
  )!;
  const article: IBbsArticle = await OpenAiFetcher.execute({
    document,
    function: func,
    connection: { host: "http://localhost:3000" },
    arguments: [
      // imagine that argument is composed by OpenAI
      {
        id: v4(),
        body: typia.random<IBbsArticle.ICreate>(),
      },
    ],
  });
  typia.assert(article);
};
main().catch(console.error);
```

At last, there can be some special API operation that some arguments must be composed by user, not by LLM (Large Language Model). For example, if an API operation requires file uploading or secret key identifier, it must be composed by user manually in the frontend application side.

For such case, `@wrtnio/openai-function-schema` supports special option [`IOpenAiDocument.IOptions.separate`](https://github.com/wrtnio/openai-function-schema/blob/master/src/structures/IOpenAiDocument.ts). If you configure the callback function, it would be utilized for determining whether the value must be composed by user or not. When the arguments are composed by both user and LLM sides, you can combine them into one through `OpenAiDataComposer.parameters()` method, so that you can still execute the function calling with `OpenAiFetcher.execute()` method.

Here is the example code of such special case:

  - Test Function: [test_combiner_keyword_parameters_query.ts](https://github.com/wrtnio/openai-function-schema/blob/main/test/features/combiner/test_combiner_keyword_parameters_query.ts)
  - Backend Server Code: [MembershipController.ts](https://github.com/wrtnio/openai-function-schema/blob/main/test/controllers/MembershipController.ts)

```typescript
import {
  IOpenAiDocument,
  IOpenAiFunction,
  IOpenAiSchema,
  OpenAiComposer,
  OpenAiDataCombiner,
  OpenAiFetcher,
  OpenAiTypeChecker,
} from "@wrtnio/openai-function-schema";
import fs from "fs";
import typia from "typia";

import { IMembership } from "../../api/structures/IMembership";

const main = async (): Promise<void> => {
  // COMPOSE OPENAI FUNCTION CALL SCHEMAS
  const swagger = JSON.parse(
    await fs.promises.readFile("swagger.json", "utf8"),
  );
  const document: IOpenAiDocument = OpenAiComposer.document({
    swagger,
    options: {
      keyword: true,
      separate: (schema: IOpenAiSchema) =>
        OpenAiTypeChecker.isString(schema) &&
        (schema["x-wrtn-secret-key"] !== undefined ||
          schema["contentMediaType"] !== undefined),
    },
  });

  // EXECUTE OPENAI FUNCTION CALL
  const func: IOpenAiFunction = document.functions.find(
    (f) => f.method === "patch" && f.path === "/membership/change",
  )!;
  const membership: IMembership = await OpenAiFetcher.execute({
    document,
    function: func,
    connection: { host: "http://localhost:3000" },
    arguments: OpenAiDataCombiner.parameters({
      function: func,
      llm: [
        // imagine that below argument is composed by OpenAI
        {
          body: {
            name: "Wrtn Technologies",
            email: "master@wrtn.io",
            password: "1234",
            age: 20,
            gender: 1,
          },
        },
      ],
      human: [
        // imagine that below argument is composed by human
        {
          query: {
            secret: "something",
          },
          body: {
            secretKey: "something",
            picture: "https://wrtn.io/logo.png",
          },
        },
      ],
    }),
  });
  typia.assert(membership);
};
main().catch(console.error);
```
