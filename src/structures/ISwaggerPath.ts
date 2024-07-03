import { ISwaggerOperation } from "./ISwaggerOperation";

export type ISwaggerPath = {
  summary?: string;
  description?: string;
} & Partial<Record<ISwaggerOperation.Method, ISwaggerOperation>>;
