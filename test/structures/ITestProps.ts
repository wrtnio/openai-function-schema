import { IConnection } from "@nestia/fetcher";
import { ISwagger } from "@wrtnio/openai-function-schema";

export interface ITestProps {
  connection: IConnection;
  swagger: ISwagger;
}
