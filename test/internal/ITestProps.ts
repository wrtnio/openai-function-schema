import { IConnection } from "@nestia/fetcher";
import {
  IOpenAiDocument,
  IOpenAiFunction,
  ISwagger,
} from "@wrtnio/openai-function-schema";

export interface ITestProps {
  connection: IConnection;
  swagger: ISwagger;
  document: (type: "keyword" | "positional") => IOpenAiDocument;
  function: (
    type: "keyword" | "positional",
  ) => (
    method: "get" | "post" | "patch" | "put" | "delete",
    path: string,
  ) => IOpenAiFunction;
}
