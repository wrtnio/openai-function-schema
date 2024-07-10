import { DynamicExecutor } from "@nestia/e2e";
import { NestFactory } from "@nestjs/core";
import {
  ISwagger,
  OpenAiComposer,
  OpenAiTypeChecker,
} from "@wrtnio/openai-function-schema";
import chalk from "chalk";
import fs from "fs";
import typia from "typia";

import { TestModule } from "./controllers/TestModule";
import { ITestProps } from "./structures/ITestProps";
import swagger from "./swagger.json";

const main = async (): Promise<void> => {
  // PREPARE SERVER
  const app = await NestFactory.create(TestModule, { logger: false });
  await app.listen(3_000);

  // ARCHIVE DOCUMENTS
  for (const keyword of [true, false])
    await fs.promises.writeFile(
      `${__dirname}/../../test/${keyword ? "keyword" : "positional"}.json`,
      JSON.stringify(
        OpenAiComposer.document({
          swagger: typia.assert<ISwagger>(swagger),
          options: {
            keyword,
            separate: (schema) =>
              OpenAiTypeChecker.isString(schema) &&
              (schema["x-wrtn-secret-key"] !== undefined ||
                schema["contentMediaType"] !== undefined),
          },
        }),
        null,
        2,
      ),
      "utf8",
    );

  // DO TEST
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test_",
    location: __dirname + "/features",
    parameters: () => [
      {
        connection: { host: `http://localhost:3000` },
        swagger: typia.assert<ISwagger>(swagger),
      } satisfies ITestProps,
    ],
    onComplete: (exec) => {
      const trace = (str: string) =>
        console.log(`  - ${chalk.green(exec.name)}: ${str}`);
      if (exec.error === null) {
        const elapsed: number =
          new Date(exec.completed_at).getTime() -
          new Date(exec.started_at).getTime();
        trace(`${chalk.yellow(elapsed.toLocaleString())} ms`);
      } else trace(chalk.red(exec.error.name));
    },
  });

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
