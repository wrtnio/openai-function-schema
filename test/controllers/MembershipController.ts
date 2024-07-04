import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { Controller, Query } from "@nestjs/common";
import typia, { tags } from "typia";

import { IMembership } from "../api/structures/IMembership";

@Controller("membership")
export class MembershipController {
  @TypedRoute.Post("join")
  public async join(
    @TypedBody() input: IMembership.IJoin,
  ): Promise<IMembership> {
    input;
    return typia.random<IMembership>();
  }

  @TypedRoute.Patch("login")
  public async login(
    @TypedBody() input: IMembership.ILogin,
  ): Promise<IMembership> {
    input;
    return typia.random<IMembership>();
  }

  @TypedRoute.Get(":secret")
  public async get(
    @TypedParam("secret")
    secret: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-secret-key": "wrtn";
      }>,
  ): Promise<IMembership> {
    secret;
    return typia.random<IMembership>();
  }

  @TypedRoute.Patch("change")
  public async changeByQuery(
    @Query("secret")
    secret: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-secret-key": "wrtn";
      }>,
    @TypedBody() input: IMembership.IJoin,
  ): Promise<IMembership> {
    typia.assert(secret);
    input;
    return typia.random<IMembership>();
  }

  @TypedRoute.Patch(":secret/change")
  public async changeByPath(
    @TypedParam("secret")
    secret: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-secret-key": "wrtn";
      }>,
    @TypedBody() input: IMembership.IJoin,
  ): Promise<IMembership> {
    secret;
    input;
    return typia.random<IMembership>();
  }
}
