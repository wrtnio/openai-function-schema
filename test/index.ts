import { DynamicExecutor } from "@nestia/e2e";
import { NestFactory } from "@nestjs/core";
import { ISwagger } from "@wrtnio/openai-function-schema";
import typia from "typia";

import { TestModule } from "./controllers/TestModule";
import { ITestProps } from "./structures/ITestProps";
import swagger from "./swagger.json";

const main = async (): Promise<void> => {
  // PREPARE SERVER
  const app = await NestFactory.create(TestModule, { logger: false });
  await app.listen(3_000);

  // DO TEST
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test_",
    parameters: () => [
      {
        connection: { host: `http://localhost:3000` },
        swagger: typia.assert<ISwagger>(swagger),
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
