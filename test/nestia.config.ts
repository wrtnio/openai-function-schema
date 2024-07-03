import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { TestModule } from "./controllers/TestModule";

export const NESTIA_CONFIG: INestiaConfig = {
  input: () => NestFactory.create(TestModule, { logger: false }),
  swagger: {
    output: "swagger.json",
    beautify: true,
  },
};
export default NESTIA_CONFIG;
