import { ISwaggerMigrateRoute } from "./ISwaggerMigrateRoute";
import { ISwaggerOperation } from "./ISwaggerOperation";

export interface ISwaggerMigrate {
  routes: ISwaggerMigrateRoute[];
  errors: ISwaggerMigrate.IError[];
}
export namespace ISwaggerMigrate {
  export interface IError {
    operation: () => ISwaggerOperation;
    method: "head" | "get" | "post" | "put" | "patch" | "delete";
    path: string;
    messages: string[];
  }
}
