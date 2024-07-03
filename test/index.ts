import { DynamicExecutor } from "@nestia/e2e";
import { NestFactory } from "@nestjs/core";
import { ISwagger, OpenAiComposer } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { TestModule } from "./controllers/TestModule";
import { ITestProps } from "./internal/ITestProps";
import swagger from "./swagger.json";

const main = async (): Promise<void> => {
  // PREPARE SERVER
  const app = await NestFactory.create(TestModule, { logger: false });
  await app.listen(3_000);

  const keyword = OpenAiComposer.compose({
    swagger: typia.assert<ISwagger>(swagger),
    options: {
      keyword: true,
    },
  });
  const positional = OpenAiComposer.compose({
    swagger: swagger as ISwagger,
    options: {
      keyword: false,
    },
  });

  // DO TEST
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test_",
    parameters: () => [
      {
        connection: { host: `http://localhost:3000` },
        swagger: swagger as ISwagger,
        document: (type) => (type === "keyword" ? keyword : positional),
        function: (type) => {
          const document = type === "keyword" ? keyword : positional;
          return (method: string, path: string) => {
            const func = document.functions.find(
              (f) => f.method === method && f.path === path,
            );
            if (!func) throw new Error(`Function not found`);
            return func;
          };
        },
      } satisfies ITestProps,
    ],
  })(__dirname + "/features");

  // REPORT EXCEPTIONS
  const exceptions: Error[] = report.executions
    .filter((exec) => exec.error !== null)
    .map((exec) => exec.error!);
  if (exceptions.length === 0) {
    console.log("Success");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  } else {
    for (const exp of exceptions) console.log(exp);
    console.log("Failed");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  }
  await app.close();
  if (exceptions.length) process.exit(-1);
};
main().catch(console.error);
