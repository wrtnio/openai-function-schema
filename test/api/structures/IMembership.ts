import { tags } from "typia";

export interface IMembership {
  id: string & tags.Format<"uuid">;
  name: string;
  email: string & tags.Format<"email">;
  age: number & tags.Type<"uint32">;
  sex: 0 | 1 | 2;
  picture: string & tags.ContentMediaType<"image/png">;
}
export namespace IMembership {
  export interface ILogin {
    secretKey?: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-secret-key": "wrtn";
      }>;
    email: string & tags.Format<"email">;
    password: string;
  }

  export interface IJoin {
    secretKey?: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-secret-key": "wrtn";
      }>;
    name: string;
    email: string & tags.Format<"email">;
    age: number & tags.Type<"uint32">;
    gender: 0 | 1 | 2;
    password: string;
    picture: string & tags.Format<"uri"> & tags.ContentMediaType<"image/png">;
  }
}
