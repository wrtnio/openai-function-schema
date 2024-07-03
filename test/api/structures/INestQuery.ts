import { tags } from "typia/lib";

/**
 * Query DTO of NestJS's `@Query()`.
 *
 * @author Samchon
 */
export interface INestQuery {
  limit?: `${number}`;
  enforce: `${boolean}`;
  atomic: string;
  values: string[] & tags.MinItems<1>;
}
