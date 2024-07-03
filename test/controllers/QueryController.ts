import { TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller, Query } from "@nestjs/common";

import { INestQuery } from "../api/structures/INestQuery";
import { IQuery } from "../api/structures/IQuery";

@Controller("query")
export class QueryController {
  @TypedRoute.Get("typed")
  public async typed(@TypedQuery() query: IQuery): Promise<IQuery> {
    return query;
  }

  @TypedRoute.Get("nest")
  public async nest(@Query() query: INestQuery): Promise<IQuery> {
    return {
      limit: query.limit !== undefined ? Number(query.limit) : undefined,
      enforce: query.enforce === "true",
      atomic: query.atomic === "null" ? null : query.atomic,
      values: Array.isArray(query.values) ? query.values : [query.values],
    };
  }

  @TypedRoute.Get("individual")
  public async individual(@Query("etc") etc: string): Promise<string> {
    return etc;
  }

  @TypedRoute.Get("composite/:id")
  public async composite(
    @TypedParam("id") id: string,
    @Query("atomic") atomic: string,
    @TypedQuery() query: Omit<IQuery, "atomic">,
  ): Promise<IQuery> {
    id;
    return {
      ...query,
      atomic,
    };
  }

  @TypedQuery.Post("body")
  public async body(@TypedQuery.Body() query: IQuery): Promise<IQuery> {
    return query;
  }
}
