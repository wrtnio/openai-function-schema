import { IConnection } from "@nestia/fetcher";
import {
  IOpenAiDocument,
  IOpenAiFunction,
  ISwagger,
} from "@wrtnio/openai-function-schema";

export interface ITestProps {
  connection: IConnection;
  swagger: ISwagger;
}
